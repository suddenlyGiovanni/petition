// ROUTE: --> /petition/signers
const signers = require( 'express' ).Router();
const db = require( '../../../modules/dbQuery' );

signers.get( '/', ( req, res, next ) => {
    db.getSigners().then( ( signers ) => {
        res.render( 'signers', {
            signers
        } );
    } );

} );

signers.get( '/:city', ( req, res, next ) => {
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

module.exports = signers;
