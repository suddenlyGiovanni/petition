// ROUTE: --> /petition/signers
const signers = require( 'express' ).Router();
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
signers.get( '/', ( req, res, next ) => {
    db.getSigners().then( ( signers ) => {
        res.render( 'signers', { signers } );
    } );

} );

module.exports = signers;
