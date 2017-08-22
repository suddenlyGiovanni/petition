// ROUTE: --> /petition/signed
const signed = require( 'express' ).Router();
const db = require( '../../../modules/dbQuery' );

signed.route( '/' )

    .all( ( req, res, next ) => {
        console.log();
        if ( req.session.signature_id == false ) {
            res.redirect( '/petition' );
        } else {
            next();
        }
    } )


    .get( ( req, res ) => {
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

signed.get( '/unsigning', ( req, res ) => {
    db.deleteSignature( req.session.user_id ).then( () => {
        req.session.signature_id = false;
        res.redirect( '/petition' );
    } );
} );

/* MODULE EXPORTS */
module.exports = signed;
