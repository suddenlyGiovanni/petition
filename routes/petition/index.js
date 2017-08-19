// ROUTE: --> /petition
const petition = require( 'express' ).Router();
const signed = require( './signed' );
const signers = require( './signers' );
// const session = require( '../../modules/checkSession' );
// const db = require( '../../modules/dbQuery' );



// if user have already signed the petition then redirect to signed
// const checkIfSigned = ( req, res, next ) => {
//     if ( req.session.signatureId ) {
//         res.redirect( '/petition/signed' );
//     } else {
//         next();
//     }
// };
// , session.checkIfSigned
petition.get( '/', ( req, res, next) => {
    res.render( 'petition' );
} );

petition.post( '/', ( req, res ) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let signature = req.body.signature;
    // console.log( firstName, lastName, signature );
    if ( firstName && lastName && signature ) {
        res.redirect( '/petition/signed' );
        // res.send(`first name ${firstName}, last name ${lastName}`);
        // res.redirect( '/signed' );
        //     res.redirect( '/petition/signed' );
        // db.query( 'INSERT INTO signatures (firstName, lastName, signature) VALUES ($1, $2, $3) RETURNING id', [
        //     firstName,
        //     lastName,
        //     signature
        // ] ).then( ( results ) => {
        //     // console.log(results.rows[0].id);
        //     req.session.signatureId = results.rows[ 0 ].id;
        //     res.redirect( '/petition/signed' );
        // } ).catch( ( err ) => {
        //     console.error( err.stack );
        // } );

        // db( 'INSERT INTO signatures (firstName, lastName, signature) VALUES ($1, $2, $3) RETURNING id', [
        //     firstName,
        //     lastName,
        //     signature
        // ] ).then( ( results ) => {
        //     // console.log(results.rows[0].id);
        //     req.session.signatureId = results.rows[ 0 ].id;
        //     res.redirect( '/petition/signed' );
        // } );
    }
} );


petition.use( '/signed', signed );
petition.use( '/signers', signers );

module.exports = petition;
