// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const express = require( 'express' );
const path = require( 'path' );
const hb = require( 'express-handlebars' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const cookieSession = require( 'cookie-session' );
const router = require( './routes' );
const secrets = require( './config/secrets.json' );

// const spicedPg = require( 'spiced-pg' );

// MODULES VARIABLES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// EXPRESS
const app = express();
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// TEMPLATING ENGINE:
// view engine setup:
app.engine( '.hbs', hb( {
    extname: '.hbs',
    defaultLayout: 'main'
} ) );

// set the views engine to use
app.set( 'view engine', '.hbs' );

// set the views folder for the templateing engine
app.set( 'views', path.join( __dirname, 'views' ) );

// MIDDLEWARE __________________________________________________________________

// BODY PARSER
app.use( bodyParser.urlencoded( {
    extended: false
} ) );

// COOKIEPARSER
app.use( cookieParser() );

// COOKIESESSION
app.use( cookieSession( {
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
} ) );

// STATIC ASSETS
// serve to the client (if it requires it) the content of the public folder.
// to the client this will be the root of the app.
app.use( express.static( path.join( __dirname, 'public' ) ) );

// ROUTING _____________________________________________________________________
//  Connect all our routes to our application
app.use( '/', router );



// ERROR:
// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

app.use( ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.render( 'error' );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// SERVER ______________________________________________________________________
app.listen( 8080, () => {
    console.log( 'listening on port 8080.' );
} );




// var db = spicedPg( `postgres:${secrets.dbUser}:${secrets.dbPass}@localhost:5432/petition` );
// if user hasn't signed then redirect to petition
// const checkIfNotSigned = ( req, res, next ) => {
//     if ( !req.session.signatureId ) {
//         res.redirect( '/petition' );
//     } else {
//         next();
//     }
// };

// if user have already signed the petition then redirect to signed
// const checkIfSigned = ( req, res, next ) => {
//     if ( req.session.signatureId ) {
//         res.redirect( '/petition/signed' );
//     } else {
//         next();
//     }
// };
