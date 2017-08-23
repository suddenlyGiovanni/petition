// ROUTE: --> /profile
const profile = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

profile.route( '/' )

    .all( ( req, res ) => {
        if (!req.session || !req.session.user_id ) {
            res.redirect('/');
        }
    } )

    .get( ( req, res ) => {
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



profile.route( '/edit' )

    .all( ( req, res ) => {
        if (!req.session || !req.session.user_id ) {
            res.redirect('/');
        }
    } )

    .get( ( req, res ) => {
        db.getUserAndProfile( req.session.user_id ).then( ( userData ) => {
            // console.log( req.session );
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




module.exports = profile;
