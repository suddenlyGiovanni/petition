// ROUTE: --> /
const router = require( 'express' ).Router();
const petition = require( './petition' );
// const session = require('../modules/checkSession');


// if user have already signed the petition then redirect to signed
// const checkIfSigned = ( req, res, next ) => {
//     if ( req.session.signatureId ) {
//         res.redirect( '/petition/signed' );
//     } else {
//         next();
//     }
// };

// , session.checkIfSigned
router.get( '/', ( req, res, next ) => {
    res.redirect( 302, '/petition' );
} );

router.use( '/petition', petition );

module.exports = router;
