// ROUTE: --> /petition
const petition = require( 'express' ).Router();
const signed = require( './signed' );
const signers = require( './signers' );
const db = require( '../../modules/dbQuery' );

petition.get( '/', ( req, res, next ) => {
    const session = req.session;
    if (session.user_id, session.firstName, session.lastName) {
        res.render( 'petition', {
            firstName : req.session.firstName,
            lastName : req.session.lastName,
            readOnly : true
        });
    } else if (session.signatureId) {
        res.redirect('/petition/signed');
    }
} );

petition.post( '/', ( req, res, next ) => {

    // check if all the required fields have been filled (the client does the same)
    // user_id coming form the register/login process
    const user_id = req.session.user_id;
    const signature = req.body.signature;

    if ( user_id && signature ) {
        db.postSignature( user_id, signature ).then( ( signatureId ) => {
            req.session.signature_id = signatureId;
            res.redirect( '/petition/signed' );
        } );
    }
} );

petition.use( '/signed', signed ).use( '/signers', signers );

module.exports = petition;
