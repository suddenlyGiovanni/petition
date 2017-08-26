// ROUTE: --> /petition
const router = require( 'express' ).Router();
const db = require( '../modules/dbQuery' );

const checkIfSigned = ( req, res, next ) => {
    console.log( '\n', 'MIDDLEWARE: checkIfSigned' );
    console.log( req.session.signature_id );

    if ( !req.session.signature_id ) {
        console.log( 'NO signature_id' );
        console.log( 'routing to /petition' );
        res.redirect( '/petition' );
    } else if ( req.session.signature_id ) {
        next();
    }
};

// MIDDLEWARE: --> /petition
router.use( ( req, res, next ) => {
    console.log( '\n', 'MIDDLEWARE: /petition' );
    if ( !req.session.user_id ) {
        console.log( 'NO user_id' );
        console.log( 'routing to /login' );
        res.redirect( '/login' );
    } else {
        console.log( `user_id =${req.session.user_id}` );
        console.log( 'authorize to view /petition && /petition/' );
        next();
    }
} );


// ROUTE: --> /petition
router.route( '/' )

    .all( ( req, res, next ) => {
        console.log( '\n', 'inside: ALL /petition' );

        if ( req.session.signature_id ) {
            console.log( `signature_id =${req.session.signature_id}` );
            console.log( 'routing to /petition/signed' );
            res.redirect( '/petition/signed' );
        } else {
            console.log( 'no signature found' );
            next();
        }
    } )

    .get( ( req, res ) => {
        console.log( '\n', 'inside: GET /petition' );
        const session = req.session;
        res.render( 'petition', {
            csrfToken: req.csrfToken(),
            firstName: session.firstName,
            lastName: session.lastName,
            readOnly: true
        } );
    } )


    .post( ( req, res ) => {
        console.log( '\n', 'inside: POST /petition' );

        // check if all the required fields have been filled (the client does the same)
        // user_id coming form the register/login process
        const user_id = req.session.user_id;
        const signature = req.body.signature;

        if ( signature ) {
            db.postSignature( user_id, signature ).then( ( signatureId ) => {
                req.session.signature_id = signatureId;
                res.redirect( '/petition/signed' );
            } );
        }
    } );


// ROUTE: --> /petition/signed
router.get( '/signed', checkIfSigned, ( req, res ) => {
    // return the signature of the provided id
    console.log( '\n', 'inside: GET /petition/signed' );
    const user_id = req.session.user_id;
    let signedData = {
        csrfToken: req.csrfToken(),
        firstName: req.session.firstName,
        lastName: req.session.lastName
    };

    const getSignature = db.getSignature( user_id )

        .then( ( signature ) => {
            return signedData.signature = signature;
        } );

    const getSigners = db.getSigners()

        .then( ( signers ) => {
            return signedData.num = signers.length;
        } );


    Promise.all( [ getSignature, getSigners ] )

        .then( () => {
            res.render( 'signed', signedData );
        } )

        .catch( ( err ) => {
            console.error( err.stack );
        } );
} );

// ROUTE: --> /petition/signed/unsign
router.get( '/signed/unsign', checkIfSigned, ( req, res ) => {
    console.log( '\n', 'inside: GET /petition/signes/unsign' );

    db.deleteSignature( req.session.user_id )

        .then( () => {
            req.session.signature_id = false;
            res.redirect( '/petition' );
        } );
} );



// ROUTE: --> /petition/signers
router.get( '/signers', checkIfSigned, ( req, res ) => {
    console.log( '\n', 'inside: GET /petition/signes' );

    db.getSigners()

        .then( ( signers ) => {
            console.log( 'log from route GET /petition/signers', signers );
            res.render( 'signers', {
                signers
            } );
        } );
} );


// ROUTE: --> /petition/signers/:city
router.get( '/signers/:city', checkIfSigned, ( req, res ) => {
    console.log( '\n', 'inside: GET /petition/signes/:city' );
    const city = req.params.city;

    db.getSignersCity( city )

        .then( ( signersByCity ) => {
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
