// ROUTE: --> /petition/signed
const signed = require( 'express' ).Router();
const db = require( '../../../modules/dbQuery' );

signed.get( '/', ( req, res, next ) => {
    // return the signature of the provided id
    const user_id = req.session.user_id;
    let signedData = {};

    const getSignature = db.getSignature( user_id ).then( ( signature ) => {
        return signedData.signature = signature;
    } );

    const getSigners = db.getSigners().then( ( signers ) => {
        return signedData.num = signers.length;
    } );


    Promise.all( [ getSignature, getSigners ] ).then( () => {
        res.render( 'signed', signedData );
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
} );

module.exports = signed;
