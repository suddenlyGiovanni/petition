// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const express = require( 'express' );
const hb = require( 'express-handlebars' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const cookieSession = require( 'cookie-session' );

const spicedPg = require( 'spiced-pg' );
const secrets = require( './secrets/secrets.json' );

// MODULES VARIABLES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
var db = spicedPg( `postgres:${secrets.dbUser}:${secrets.dbPass}@localhost:5432/petition` );

// EXPRESS______________________________________________________________________
const app = express();

// MIDDLEWARE __________________________________________________________________

// BODY PARSER _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.use( bodyParser.urlencoded( {
    extended: false
} ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// COOKIEPARSER
app.use( cookieParser() );

// if user hasn't signed then redirect to petition
const checkIfNotSigned = ( req, res, next ) => {
    if ( !req.session.signatureId ) {
        res.redirect( '/petition' );
    } else {
        next();
    }
};

// if user have already signed the petition then redirect to signed
const checkIfSigned = ( req, res, next ) => {
    if ( req.session.signatureId ) {
        res.redirect( '/petition/signed' );
    } else {
        next();
    }
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// COOKIEPARSER_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.use( cookieSession( {
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
} ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// STATIC ASSETS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// serve to the client (if it requires it) the content of the public folder.
// to the client this will be the root of the app.
app.use( express.static( __dirname + '/public' ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// TEMPLATING ENGINE: HBS_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

app.engine( '.hbs', hb( {
    extname: '.hbs',
    defaultLayout: 'main'
} ) );

// set the views engine to use
app.set( 'view engine', '.hbs' );

// set the views folder for the templateing engine
app.set( 'views', './views' );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// ERROR HANDLING_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.use( ( err, req, res, next ) => {
    console.error( err.stack );
    res.status( 500 ).send( 'Something broke!' );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// ROUTING _____________________________________________________________________

app.get( '/', checkIfSigned, ( req, res ) => {
    res.redirect( 302, '/petition' );
} );

app.get( '/petition', checkIfSigned, ( req, res ) => {
    res.render( 'petition' );
} );

app.post( '/petition', ( req, res ) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let signature = req.body.signature;
    // console.log( firstName, lastName, signature );
    if ( firstName && lastName && signature ) {
        db.query( 'INSERT INTO signatures (firstName, lastName, signature) VALUES ($1, $2, $3) RETURNING id', [
            firstName,
            lastName,
            signature
        ] ).then( ( results ) => {
            // console.log(results.rows[0].id);
            req.session.signatureId = results.rows[ 0 ].id;
            res.redirect( '/petition/signed' );
        } ).catch( ( err ) => {
            console.error( err.stack );
        } );
    }
} );

app.get( '/petition/signed', checkIfNotSigned, ( req, res ) => {
    let id = req.session.signatureId;
    db.query( `SELECT signature FROM signatures WHERE id='${id}'` ).then( ( results ) => {
        res.render( 'signed', {
            signature: results.rows[ 0 ].signature
        } );
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
} );

app.get( '/petition/signers', checkIfNotSigned, ( req, res ) => {

    db.query( 'SELECT firstName AS "firstName", lastName AS "lastName" FROM signatures' ).then( ( results ) => {
        // console.log( results.rows );
        res.render( 'signers', {
            signers: results.rows
        } );
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
} );




// SERVER ______________________________________________________________________
app.listen( 8080, () => {
    console.log( 'listening on port 8080.' );
} );
