// ROUTE: --> /petition/signed
const signed = require( 'express' ).Router();
// const session = require( '../../../modules/checkSession' );
const db = require( '../../../modules/dbQuery' );

// if user has not yet signed then redirect to petition
// const checkIfNotSigned = ( req, res, next ) => {
//     if ( !req.session.signatureId ) {
//         res.redirect( '/petition' );
//     } else {
//         next();
//     }
// };
// session.checkIfNotSigned,
signed.get( '/', ( req, res, next ) => {
    // return the signature of the provided id
    const user_id = req.session.user_id;
    console.log(req.session);
    db.getSignature( user_id ).then( ( signature ) => {
        res.render( 'signed', { signature } );
    } );
} );

module.exports = signed;
