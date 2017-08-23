// ROUTE: --> /petition/signed
const signed = require( 'express' ).Router();
const db = require( '../../../modules/dbQuery' );

signed.route( '/' )

    .all( ( req, res, next ) => {
        if ( !req.session || !req.session.user_id ) {
            res.render( 'error', {
                message: 'user unauthorized'
            } );
            // res.redirect( '/' );
        }
        if ( req.session.signature_id == false ) {
            res.render( 'error', {
                message: 'you have already signed the petition'
            } );
            // res.redirect( '/petition' );
        }
        next();
    } )


    .get( ( req, res ) => {
        // return the signature of the provided id
        const user_id = req.session.user_id;
        let signedData = {
            csrfToken: req.csrfToken()
        };

        const getSignature = db.getSignature( user_id ).then( ( signature ) => {
            return signedData.signature = signature;
        } );

        const getSigners = db.getSigners().then( ( signers ) => {
            return signedData.num = signers.length;
        } );


        Promise.all( [ getSignature, getSigners ] ).then( () => {
            console.log( 'about to render /petiotion/signed' );
            res.render( 'signed', signedData );
        } ).catch( ( err ) => {
            console.error( err.stack );
        } );
    } );

signed.get( '/tounsign', ( req, res ) => {
    if ( req.session.user_id && req.session.signature_id ) {
        console.log( 'delete signature request' );
        db.deleteSignature( req.session.user_id ).then( () => {
            req.session.signature_id = false;
            res.redirect( '/petition' );
        } );

    } else {
        res.render( 'error', {
            message: 'user unauthorized'
        } );
    }
} );


/* MODULE EXPORTS */
module.exports = signed;
