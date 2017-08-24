// ROUTE: --> /petition/signers
const signers = require( 'express' ).Router();
const db = require( '../../../modules/dbQuery' );

signers.route( '/' )

    .all( ( req, res, next ) => {
        if (!req.session || !req.session.user_id) {
            res.render('error', {message : 'user unauthorized'});
            // res.redirect( '/' );
        }
        if ( req.session.signature_id == false ) {
            res.redirect( '/petition' );
        }
        next();
    } )

    .get( ( req, res ) => {
        db.getSigners().then( ( signers ) => {
            res.render( 'signers', {
                signers
            } );
        } );
    } );

// ROUTE: --> /petition/signers/:city
signers.get( '/:city', ( req, res ) => {
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
module.exports = signers;
