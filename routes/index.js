// ROUTE: --> /
const router = require( 'express' ).Router();
const register = require( './register' );
const login = require( './login' );
const petition = require( './petition' );
const profile = require( './profile' );


router.get('/', (req,res) =>{
    res.render('welcome');
});

router.use( '/profile', profile );
router.use( '/register', register );
router.use( '/login', login );
router.use( '/petition', petition );

/* MODULE EXPORTS */
module.exports = router;
