// ROUTE: --> /
const router = require( 'express' ).Router();
const register = require( './register' );
const login = require( './login' );
const petition = require( './petition' );
const profile = require( './profile' );

// if the user is already signed in then redirect to next route point;
// router.get( '/', ( req, res ) => {
//     const session = req.session;
//     if ( session.user_id ) {
//         console.log( 'user_id: ', session.user_id );
//         res.redirect('/petition');
//     } else if ( !session.user_id ) {
//         console.log( 'session: ', session);
//         res.redirect('/register');
//     }
// } );

// router.use((req,res)=>{
//     const session = req.session;
//     if ( session.user_id ) {
//         console.log( 'user_id: ', session.user_id );
//         res.redirect('/petition');
//     } else if ( !session.user_id ) {
//         console.log( 'session: ', session);
//         res.redirect('/register');
//     }
// });

router.use( '/profile', profile );
router.use( '/register', register );
router.use( '/login', login );
router.use( '/petition', petition );

/* MODULE EXPORTS */
module.exports = router;
