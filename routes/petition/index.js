// ROUTE: --> /petition
const petition = require( 'express' ).Router();
const signed = require( './signed' );
const signers = require( './signers' );
const db = require( '../../modules/dbQuery' );

petition.route( '/' )

    .all( ( req, res, next ) => {
        if (!req.session) {
            res.redirect('/register');
        }
        if (req.session.signature_id) {
            console.log('inside / petition, about to redirect');
            res.redirect('/petition/signed');
        }
        next();
    } )

    .get( ( req, res ) => {
        const session = req.session;

        if ( session.user_id && session.firstName && session.lastName ) {
            res.render( 'petition', {
                csrfToken: req.csrfToken(),
                firstName: session.firstName,
                lastName: session.lastName,
                readOnly: true
            } );
        }
    } )


    .post( ( req, res ) => {

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

// petition.use()
petition.use( '/signed', signed );
petition.use( '/signers', signers );

module.exports = petition;
