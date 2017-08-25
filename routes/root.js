// ROUTE: --> /
const router = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );


// works for /, /login, /register,
const redirectIfLoggedOrSigned = ( req, res, next ) => {
    console.log( '\n', 'MIDDLEWARE: checkIfLoggedIn' );
    if ( req.session.user_id && req.session.signature_id ) {
        console.log( `user_id =${req.session.user_id} && signature_id =${req.session.signature_id}` );
        console.log( 'routing to /petition/signed' );
        res.redirect( '/petition/signed' );
    } else if ( req.session.user_id && !req.session.signature_id ) {
        console.log( `user_id =${req.session.user_id} && NO signature_id` );
        console.log( 'routing to /petition' );
        res.redirect( '/petition' );
    } else if ( !req.session.user_id && !req.session.signature_id ) {
        console.log( 'NO user_id  && NO signature_id' );
        console.log( 'access to /' );
        next();
    }
};


// ROUTE: --> /
router.get( '/', redirectIfLoggedOrSigned, ( req, res ) => {
    console.log( '\n', 'inside: GET /' );
    res.render( 'welcome' );
} );

// ROUTE: --> /login
router.route( '/login' )

    .all( redirectIfLoggedOrSigned, ( req, res, next ) => {
        next();
    } )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /login' );
        res.render( 'login', {
            csrfToken: req.csrfToken()
        } );
    } )

    .post( ( req, res ) => {
        const email = req.body.email.toLowerCase();
        const password = req.body.password.toLowerCase();

        db.checkUser( email, password ).then( ( userSession ) => {
            if ( !userSession ) {
                res.render( 'error', {
                    message: 'wrong mail and password'
                } );
            } else {
                req.session.user_id = userSession.user_id;
                req.session.firstName = userSession.firstName;
                req.session.lastName = userSession.lastName;
                req.session.signature_id = userSession.signature_id;
                if ( !userSession.signature_id ) {
                    res.redirect( '/petition' );
                } else {
                    res.redirect( '/petition/signed' );
                }
            }
        } );
    } );

// ROUTE: --> /logout

router.get( '/logout', ( req, res ) => {
    req.session.destroy();
    console.log( 'logging out',
        req.session );
    res.redirect( '/' );
} );


// ROUTE: --> /register
router.route( '/register' )

    .all( redirectIfLoggedOrSigned, ( req, res, next ) => {
        next();
    } )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /register' );
        res.render( 'register', {
            csrfToken: req.csrfToken()
        } );
    } )

    .post( ( req, res ) => {

        const firstName = req.body.firstName.toLowerCase();
        const lastName = req.body.lastName.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password.toLowerCase();

        if ( firstName && lastName && email && password ) {
            db.postUser( firstName, lastName, email, password ).then( ( userSession ) => {
                req.session.user_id = userSession.user_id;
                req.session.firstName = userSession.firstName;
                req.session.lastName = userSession.lastName;
                req.session.signature_id = userSession.signature_id;
                res.redirect( '/profile' );
            } );
        }
    } );



// MIDDLEWARE: --> /profile
router.use( '/profile', ( req, res, next ) => {
    console.log( '\n', 'MIDDLEWARE: /profile' );

    if ( !req.session.user_id ) {
        console.log( 'NO user_id' );
        console.log( 'routing to /login' );
        res.redirect( '/login' );
    } else if ( req.session.user_id ) {
        console.log( `user_id =${req.session.user_id}` );
        console.log( 'authorize to edit profile' );
        next();
    }
} );


// ROUTE: --> /profile
router.route( '/profile' )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /profile' );
        res.render( 'profile', {
            csrfToken: req.csrfToken()
        } );
    } )

    .post( ( req, res ) => {
        const user_id = req.session.user_id;
        const age = ( req.body.age ) ? req.body.age : null;
        const city = ( req.body.city ) ? req.body.city.toLowerCase() : null;
        const url = ( req.body.url ) ? req.body.url.toLowerCase() : null;
        if ( user_id ) {
            db.postUserProfile( user_id, age, city, url ).then( () => {
                res.redirect( '/petition' );
            } );
        } // TODO: add an error notification
    } );


// ROUTE: --> /profile/edit
router.route( '/profile/edit' )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /profile/edit' );
        db.getUserAndProfile( req.session.user_id ).then( ( userData ) => {
            res.render( 'edit', {
                userData: userData,
                csrfToken: req.csrfToken()
            } );
        } );
    } )


    .post( ( req, res ) => {
        // data to set to the users table:
        const firstName = req.body.firstName.toLowerCase();
        const lastName = req.body.lastName.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = ( req.body.password ) ? req.body.password.toLowerCase() : null;
        // data to set to the user_profiles table:
        const user_id = req.session.user_id;
        const age = ( req.body.age ) ? req.body.age : null;
        const city = ( req.body.city ) ? req.body.city.toLowerCase() : null;
        const url = ( req.body.url ) ? req.body.url.toLowerCase() : null;

        if ( user_id ) {
            db.putUserAndProfile( firstName, lastName, email, password, user_id, age, city, url ).then( () => {
                req.session.firstName = firstName;
                req.session.lastName = lastName;
                res.redirect( '/petition' );
            } );
        } // TODO: add an error notification
    } );



/* MODULE EXPORTS */
module.exports = router;
