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
signed.get( '/', ( req, res ) => {
    let data = {};
    // return the signature of the provided id
    db.getSignature( req.session.signatureId ).then( ( signature ) => {
        data.signature = signature;
    } ).then( () => {
        db.getSigners().then( ( signers ) => {
            data.signersNum = signers.length;
        } );
    } ).then( () => {
        res.render( 'signed', data );
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );


} );

module.exports = signed;
