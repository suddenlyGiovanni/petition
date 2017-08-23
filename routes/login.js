// ROUTE: --> /login
const login = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

login.route( '/' )

    .all( ( req, res, next ) => {
        if ( req.session.user_id ) {
            res.redirect( '/petition' );
        }
        next();
    } )

    .get( ( req, res ) => {
        res.render( 'login', {
            csrfToken: req.csrfToken()
        } );
    } )

    .post( ( req, res ) => {

        const email = req.body.email;
        const password = req.body.password;

        db.checkUser( email, password ).then( ( userSession ) => {
            if ( !userSession ) {
                res.render( 'error', {
                    message: 'wrong mail and password'
                } );
            } else {
                if ( !userSession.signature_id ) {
                    req.session = userSession;
                    res.redirect( '/petition' );
                } else {
                    req.session = userSession;
                    res.redirect( '/petition/signed' );
                }
            }
        } );
    } );

/* MODULE EXPORTS */
module.exports = login;
