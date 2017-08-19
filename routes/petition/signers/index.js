// ROUTE: --> /petition/signers
const signers = require( 'express' ).Router();
// const session = require( '../../../modules/checkSession' );
// const db = require( '../../../modules/dbQuery' );

// if user has not yet signed then redirect to petition
// const checkIfNotSigned = ( req, res, next ) => {
//     if ( !req.session.signatureId ) {
//         res.redirect( '/petition' );
//     } else {
//         next();
//     }
// };
// session.checkIfNotSigned,
signers.get( '/', ( req, res ) => {

    // db.query( 'SELECT firstName AS "firstName", lastName AS "lastName" FROM signatures' ).then( ( results ) => {
    //     // console.log( results.rows );
    //     res.render( 'signers', {
    //         signers: results.rows
    //     } );
    // } ).catch( ( err ) => {
    //     console.error( err.stack );
    // } );
    // db( 'SELECT firstName AS "firstName", lastName AS "lastName" FROM signatures' ).then( ( results ) => {
    //     // console.log( results.rows );
    //     res.render( 'signers', {
    //         signers: results.rows
    //     } );
    // } );
    res.render('signers');

} );

module.exports = signers;
