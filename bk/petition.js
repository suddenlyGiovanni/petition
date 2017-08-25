// ROUTE: --> /petition/signed
const router = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );


router.use( ( req, res, next ) => {
    console.log( '\n', 'MIDDLEWARE: /petition la deee daaaa' );
    // if ( !req.session || !req.session.user_id ) {
    //     console.log( 'no session routing to /register' );
    //     res.redirect( '/register' );
    // }
    next();
} );




// ROUTE: --> /petition
router.route( '/' )

    // .all( ( req, res, next ) => {
    //     // if ( !req.session || !req.session.user_id ) {
    //     //     res.res.render( 'error', {
    //     //         message: 'user unauthorized'
    //     //     } );
    //     //     // res.redirect( '/' );
    //     // }
    //     if ( req.session.signature_id ) {
    //
    //         res.redirect( '/petition/signed' );
    //     }
    //     next();
    // } )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /petition' );
        const session = req.session;

        // if ( session.user_id && session.firstName && session.lastName ) {
        res.render( 'petition', {
            csrfToken: req.csrfToken(),
            firstName: session.firstName,
            lastName: session.lastName,
            readOnly: true
        } );
        // }
    } )


    .post( ( req, res ) => {
        console.log( '\n', 'inside: POST /petition' );

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



// ROUTE: --> /petition/signed
router.route( '\n', '/signed' )

    // .all( ( req, res, next ) => {
    //     if ( !req.session || !req.session.user_id ) {
    //         res.render( 'error', {
    //             message: 'user unauthorized'
    //         } );
    //         // res.redirect( '/' );
    //     }
    //     if ( req.session.signature_id == false ) {
    //         res.render( 'error', {
    //             message: 'you have already signed the petition'
    //         } );
    //         // res.redirect( '/petition' );
    //     }
    //     next();
    // } )


    .get( ( req, res ) => {
        // return the signature of the provided id
        console.log( '\n', 'inside: GET /petition/signed' );
        const user_id = req.session.user_id;
        let signedData = {
            csrfToken: req.csrfToken()
        };

        const getSignature = db.getSignature( user_id ).then( ( signature ) => {
            return signedData.signature = signature;
        } );

        const getSigners = db.getSigners().then( ( signers ) => {
            return signedData.num = signers.length;
        } );


        Promise.all( [ getSignature, getSigners ] ).then( () => {
            res.render( 'signed', signedData );
        } ).catch( ( err ) => {
            console.error( err.stack );
        } );
    } );

// ROUTE: --> /petition/signed/unsign
router.get( '/signed/unsign', ( req, res ) => {
    console.log( '\n', 'inside: GET /petition/signes/unsign' );
    db.deleteSignature( req.session.user_id ).then( () => {
        req.session.signature_id = false;
        res.redirect( '/petition' );
    } );
    // if ( req.session.user_id && req.session.signature_id ) {
    //
    // } else {
    //     res.render( 'error', {
    //         message: 'user unauthorized'
    //     } );
    // }
} );



// ROUTE: --> /petition/signers
router.route( '/signers' )

    // .all( ( req, res, next ) => {
    //     if (!req.session || !req.session.user_id) {
    //         res.render('error', {message : 'user unauthorized'});
    //         // res.redirect( '/' );
    //     }
    //     if ( req.session.signature_id == false ) {
    //         res.redirect( '/petition' );
    //     }
    //     next();
    // } )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /petition/signes' );
        db.getSigners().then( ( signers ) => {
            res.render( 'signers', {
                signers
            } );
        } );
    } );


// ROUTE: --> /petition/signers/:city
router.get( '/signers/:city', ( req, res ) => {
    console.log( '\n', 'inside: GET /petition/signes/:city' );
    const city = req.params.city;
    db.getSignersCity( city ).then( ( signersByCity ) => {
        const signers = {
            city: city,
            num: signersByCity.rowCount,
            signers: signersByCity.rows
        };
        res.render( 'city', {
            signers
        } );
    } );
} );




/* MODULE EXPORTS */
module.exports = router;
