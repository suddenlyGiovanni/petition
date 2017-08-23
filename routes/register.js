// ROUTE: --> /register
const register = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

register.route( '/' )

    .all( ( req, res, next ) => {
        if ( req.session.user_id ) {
            res.redirect( '/petition' );
        }

        next();
    } )

    .get( ( req, res ) => {
        res.render( 'register', {
            csrfToken: req.csrfToken()
        } );
    } )

    .post( ( req, res ) => {

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        if ( firstName && lastName && email && password ) {
            db.postUser( firstName, lastName, email, password ).then( ( userSession ) => {
                req.session = userSession;
                res.redirect( '/profile' );
            } );
        }
    } );

/* MODULE EXPORTS */
module.exports = register;
