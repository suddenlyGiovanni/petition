// ROUTE: --> /login
const login = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

login.route( '/' )

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
        res.render( 'login', { csrfToken: req.csrfToken() } );
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
                req.session = userSession;
                if ( !userSession.signature_id ) {
                    res.redirect( '/petition' );
                } else {
                    res.redirect( '/petition/signed' );
                }
            }
        } );
    } );

/* MODULE EXPORTS */
module.exports = login;
