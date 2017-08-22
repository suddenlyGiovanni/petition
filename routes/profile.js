// ROUTE: --> /profile
const profile = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

profile.get( '/', ( req, res, next ) => {
    res.render( 'profile' );
} );

profile.post( '/', ( req, res, next ) => {
    const user_id = req.session.user_id;
    const age = ( req.body.age ) ? req.body.age : null;
    const city = ( req.body.city ) ? req.body.city : null;
    const url = ( req.body.url ) ? req.body.url : null;
    if ( user_id ) {
        db.postUserProfile( user_id, age, city, url ).then( () => {
            res.redirect( '/petition' );
        } );
    } // TODO: add an error notification
} );


profile.get( '/edit', ( req, res, next ) => {
    db.getUserAndProfile( req.session.user_id ).then( ( userData ) => {
        // console.log( req.session );
        res.render( 'edit', {
            userData
        } );
    } );
} );


profile.post( '/edit', ( req, res, next ) => {
    // data to set to the users table:
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = ( req.body.password ) ? req.body.password : null;
    // data to set to the user_profiles table:
    const user_id = req.session.user_id;
    const age = ( req.body.age ) ? req.body.age : null;
    const city = ( req.body.city ) ? req.body.city : null;
    const url = ( req.body.url ) ? req.body.url : null;

    if ( user_id ) {
        db.putUserAndProfile( firstName, lastName, email, password, user_id, age, city, url ).then( () => {
            req.session.firstName =  firstName;
            req.session.lastName =  lastName;
            // console.log( req.session );
            res.redirect( '/petition' );
        } );
    } // TODO: add an error notification
} );




module.exports = profile;
