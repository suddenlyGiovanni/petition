// ROUTE: --> /petition/signed
const signed = require( 'express' ).Router();
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
signed.get( '/',  ( req, res ) => {
    res.render('signed');
    // let id = req.session.signatureId;

    // db.query( `SELECT signature FROM signatures WHERE id='${id}'` ).then( ( results ) => {
    //     res.render( 'signed', {
    //         signature: results.rows[ 0 ].signature
    //     } );
    // } ).catch( ( err ) => {
    //     console.error( err.stack );
    // } );
    // db( `SELECT signature FROM signatures WHERE id='${id}'` ).then( ( results ) => {
    //     res.render( 'signed', {
    //         signature: results.rows[ 0 ].signature
    //     } );
    // } );
} );

module.exports = signed;
