// ROUTE: --> /register
const register = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

register.route( '/' )

    .all( ( req, res, next ) => {
        if ( req.session.user_id && req.session.signature_id ) {
            res.redirect( '/petition/signed' );
        }
        if ( req.session.user_id && !req.session.signature_id ) {
            res.redirect( '/petition' );
        }
        next();
    } )

    .get( ( req, res ) => {
        res.render( 'register', { csrfToken: req.csrfToken() } );
    } )

    .post( ( req, res ) => {

        const firstName = req.body.firstName.toLowerCase();
        const lastName = req.body.lastName.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password.toLowerCase();

        if ( firstName && lastName && email && password ) {
            db.postUser( firstName, lastName, email, password ).then( ( userSession ) => {
                req.session = userSession;
                res.redirect( '/profile' );
            } );
        }
    } );

/* MODULE EXPORTS */
module.exports = register;
