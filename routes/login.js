// ROUTE: --> /login
const login = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );


login.get( '/', ( req, res, next ) => {
    res.render( 'login' );
} );

login.post( '/', ( req, res, next ) => {
    const email = req.body.email;
    const password = req.body.password;
    db.checkUser( email, password ).then( ( userSession ) => {
        if ( typeof userSession !== 'undefined' ) {
            req.session = userSession;
            res.redirect( '/petition' );
        } else {
            res.status( 401 ).render( 'error', {
                message: 'UNAUTIORIZED'
            } );
        }
    } );
} );

module.exports = login;
