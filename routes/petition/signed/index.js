// ROUTE: --> /petition/signed
const signed = require( 'express' ).Router();
// const session = require( '../../../modules/checkSession' );
const db = require( '../../../modules/dbQuery' );

// if user has not yet signed then redirect to petition
const checkIfNotSigned = ( req, res, next ) => {
    if ( !req.session.signatureId ) {
        res.redirect( '/petition' );
    } else {
        next();
    }
};
// session.checkIfNotSigned,
signed.get( '/', checkIfNotSigned, ( req, res ) => {

    // return the signature of the provided id
    db.getSignature( req.session.signatureId ).then( ( signature ) => {
        res.render( 'signed', {signature} );
    } );

} );

module.exports = signed;
