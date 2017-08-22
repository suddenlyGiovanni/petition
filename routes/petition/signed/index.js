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

signed.get( '/unsigning', ( req, res, next ) => {
    db.deleteSignature( req.session.user_id ).then( () => {
        delete req.session.signature_id;
        res.redirect( '/petition' );
    } );
} );

module.exports = signed;
