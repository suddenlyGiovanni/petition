// ROUTE: --> /petition
const petition = require( 'express' ).Router();
const signed = require( './signed' );
const signers = require( './signers' );
// const session = require( '../../modules/checkSession' );
const db = require( '../../modules/dbQuery' );



// if user have already signed the petition then redirect to signed
const checkIfSigned = ( req, res, next ) => {
    if ( req.session.signatureId ) {
        res.redirect( '/petition/signed' );
    } else {
        next();
    }
};
// , session.checkIfSigned
petition.get( '/', checkIfSigned, ( req, res, next ) => {
    res.render( 'petition' );
} );

petition.post( '/', checkIfSigned, ( req, res, next ) => {
    const user_id = Math.floor( ( Math.random() * 10 ) );
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const signature = req.body.signature;
    if ( user_id && firstName && lastName && signature ) {
        db.postSignature( user_id, firstName, lastName, signature ).then( ( signatureId ) => {
            req.session.signatureId = signatureId;
            res.redirect( '/petition/signed' );
        } );
    }
} );


petition.use( '/signed', signed );
petition.use( '/signers', signers );

module.exports = petition;
