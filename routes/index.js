// ROUTE: --> /
const router = require( 'express' ).Router();
const register = require( './register' );
const login = require( './login' );
const petition = require( './petition' );

// TODO: fix this middleware it need to point to /petition/signed
// router.use( ( req, res, next ) => {
//     if ( req.session.signatureId ) {
//         // res.status( 401 );
//         console.log('signature id detected');
//         res.redirect('/petition/signed');
//         // next();
//         // TODO: turn on this filter
//         // res.render( 'error', {
//         //     message: 'already signed the petition'
//         // } );
//     } else {
//         next();
//     }
// } );


router.get( '/', ( req, res, next ) => {
    res.redirect( 302, '/register' );
} );

router.use( '/register', register );
router.use( '/login', login );
router.use( '/petition', petition );

module.exports = router;
