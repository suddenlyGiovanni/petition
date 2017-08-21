// ROUTE: --> /register
const register = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

register.get( '/', ( req, res, next ) => {
    res.render( 'register' );
} );

register.post( '/', ( req, res, next ) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    if ( firstName && lastName && email && password ) {
        db.postUser( firstName, lastName, email, password ).then( ( userSession ) => {
            req.session = userSession;
            // console.log( req.session );
            res.redirect( '/login' );
        } );
    }
} );

module.exports = register;
