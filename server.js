// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const express = require( 'express' );
const morgan = require('morgan');
const path = require( 'path' );
const hb = require( 'express-handlebars' );
const cookieParser = require( 'cookie-parser' );
// can remove cookie-session
const cookieSession = require( 'cookie-session' );
const csrf = require( 'csurf' );
const bodyParser = require( 'body-parser' );
// const router = require( './routes' );
const sessionSecret = process.env.SESSIONSECRET || require( './config/secrets.json' ).sessionSecret;

// MODULES VARIABLES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// EXPRESS
const app = express();
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// HTTP request logger middleware
// app.use(morgan('dev'))


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
app.use( bodyParser.urlencoded( { extended: false } ) );

// COOKIEPARSER
app.use( cookieParser() );

// COOKIESESSION
app.use( cookieSession( {
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
} ) );



// STATIC ASSETS
// serve to the client (if it requires it) the content of the public folder.
// to the client this will be the root of the app.
app.use( express.static( path.join( __dirname, 'public' ) ) );



// CSURF ___________________________________________________________________
app.use( csrf( {
    cookie: true
} ) );

// ROUTING _____________________________________________________________________
//  Connect all our routes to our application
app.use( '/', require('./routes/root') );
app.use( '/petition', require('./routes/petition') );



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
const listener = app.listen( process.env.PORT || 8080, () => {
    console.log( `listening on port ${listener.address().port}.` );
} );
