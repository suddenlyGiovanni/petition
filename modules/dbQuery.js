// dbQuery.js

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const spicedPg = require( 'spiced-pg' );
const {
    dbUser,
    dbPass,
    dbName
} = require( '../config/secrets.json' );


// MODULES VARIABLES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const db = spicedPg( `postgres:${dbUser}:${dbPass}@localhost:5432/${dbName}` );


// save new signature to DB
const postSignature = ( user_id, firstName, lastName, signature ) => {
    const query = 'INSERT INTO signatures (user_id, firstName, lastName, signature) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query( query, [
        user_id,
        firstName,
        lastName,
        signature
    ] ).then( ( results ) => {
        // console.log(results.rows[ 0 ].id);
        // returns the id of the signer
        return results.rows[ 0 ].id;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// retrieve specified signature form DB
const getSignature = ( id ) => {
    return db.query( `SELECT signature FROM signatures WHERE id='${id}'` ).then( ( results ) => {
        return results.rows[ 0 ].signature;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// retrieve all the signers form DB
const getSigners = () => {
    return db.query( 'SELECT firstName AS "firstName", lastName AS "lastName" FROM signatures' ).then( ( results ) => {
        return results.rows;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};




module.exports.postSignature = postSignature;
module.exports.getSignature = getSignature;
module.exports.getSigners = getSigners;
