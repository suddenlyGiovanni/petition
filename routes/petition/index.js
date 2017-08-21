// ROUTE: --> /petition
const petition = require( 'express' ).Router();
const signed = require( './signed' );
const signers = require( './signers' );
const db = require( '../../modules/dbQuery' );

// if user have already signed the petition then redirect to signed
// petition.use( ( req, res, next ) => {
//     if ( req.session.signatureId ) {
//         res.redirect( '/petition/signed' );
//     } else {
//         next();
//     }
// } );


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

// can switch to a db query if necessary
petition.use( ( req, res, next ) => {
    if ( !req.session.signatureId ) {
        res.status( 401 );
        // TODO: turn on this filter
        // res.render( 'error', {
        //     message: 'UNAUTIORIZED'
        // } );
        next();
    } else {
        next();
    }
} ).use( '/signed', signed ).use( '/signers', signers );

module.exports = petition;
