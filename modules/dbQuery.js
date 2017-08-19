// dbQuery.js

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const spicedPg = require( 'spiced-pg' );
const secrets = require('../config/secrets.json');


// MODULES VARIABLES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const db = spicedPg( `postgres:${secrets.dbUser}:${secrets.dbPass}@localhost:5432/petition` );


module.exports = ( query ) => {
    db.query( query ).then( ( results ) => {
        return results;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};
