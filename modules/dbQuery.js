// dbQuery.js

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const spicedPg = require( 'spiced-pg' );

const {
    dbUser,
    dbPass,
    dbName
} = require( '../config/secrets.json' );

const {
    hashPassword,
    checkPassword
} = require( './hasher' );

// MODULES VARIABLES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const db = spicedPg( `postgres:${dbUser}:${dbPass}@localhost:5432/${dbName}` );

// CREATE NEW USER
const postUser = ( firstName, lastName, email, password ) => {
    // hash user password with bcrypt ( hashPassword ) before saving
    return hashPassword( password ).then( ( hashedPass ) => {
        const query = 'INSERT INTO users ( "firstName", "lastName", email, password) VALUES ($1, $2, $3, $4) RETURNING id, "firstName", "lastName"';
        return db.query( query, [
            firstName,
            lastName,
            email,
            hashedPass
        ] );
    } ).then( ( userSession ) => {
        return {
            user_id: userSession.rows[ 0 ].id,
            firstName: userSession.rows[ 0 ].firstName,
            lastName: userSession.rows[ 0 ].lastName
        };
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// GET USER
const getUserAndProfile = ( user_id ) => {
    const query = `SELECT users."firstName", users."lastName", users.email ,user_profiles.age, user_profiles.city, user_profiles.url
    FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE users.id = ${user_id}`;
    return db.query( query ).then( ( userData ) => {
        return userData.rows;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// UPDATE NEW USER
const putUserAndProfile = ( firstName, lastName, email, password, user_id, age, city, url ) => {

    if ( !password || password === null ) {
        const query = `UPDATE users
        SET "firstName" = $1, "lastName" = $2, email = $3
        WHERE id = ${user_id}`;
        const queryParams = [
            firstName,
            lastName,
            email
        ];
        return db.query( query, queryParams ).then( () => {
            const query = `UPDATE user_profiles
            SET age = $1, city = $2, url = $3
            WHERE user_id = ${user_id};`;
            return db.query( query, [
                age,
                city,
                url
            ] ).catch( ( err ) => {
                console.error( err.stack );
            } );
        } );
    } else if ( password ) {
        return hashPassword( password ).then( ( hashedPass ) => {
            const query = `UPDATE users
            SET "firstName" = $1, "lastName" = $2, email = $3, password = $4
            WHERE id = ${user_id}`;
            return db.query( query, [
                firstName,
                lastName,
                email,
                hashedPass
            ] );
        } ).then( () => {
            const query = `UPDATE user_profiles
            SET age = $1, city = $2, url = $3
            WHERE user_id = ${user_id};`;
            return db.query( query, [
                age,
                city,
                url
            ] ).catch( ( err ) => {
                console.error( err.stack );
            } );
        } );
    }
};




// AUTHENTICATE USER
const checkUser = ( email, password ) => {
    // step 1 - search on db for matching email.
    const query = 'SELECT id, "firstName", "lastName", email, password FROM users WHERE email = $1';
    return db.query( query, [ email ] ).then( ( dbUser ) => {
        return {
            id: dbUser.rows[ 0 ].id,
            firstName: dbUser.rows[ 0 ].firstName,
            lastName: dbUser.rows[ 0 ].lastName,
            email: dbUser.rows[ 0 ].email,
            hashedPass: dbUser.rows[ 0 ].password
        };
    } ).then( ( dbUser ) => {
        // step 2 - convert provided password and checkPassword
        // step 3 - checkPassword returns either true or false.
        return checkPassword( password, dbUser.hashedPass ).then( ( doesMatch ) => {
            if ( !doesMatch ) {
                throw 'wrong email and password';
            }
            return {
                user_id: dbUser.id,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
            };
        } );
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// ADD NEW PROFILE to A USER
const postUserProfile = ( user_id, age, city, url ) => {
    const query = 'INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1, $2, $3, $4)';
    return db.query( query, [
        user_id,
        age,
        city,
        url
    ] ).then( () => {
        return;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};


// save new signature to DB
const postSignature = ( user_id, signature ) => {
    const query = 'INSERT INTO signatures (user_id, signature) VALUES ($1, $2) RETURNING id';
    return db.query( query, [
        user_id,
        signature
    ] ).then( ( signatureId ) => {
        // returns the id of the signer
        return signatureId.rows[ 0 ].id;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// retrieve specified signature form DB
const getSignature = ( user_id ) => {
    return db.query( 'SELECT signature FROM signatures WHERE id = $1', [ user_id ] ).then( ( results ) => {
        return results.rows[ 0 ].signature;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// retrieve all the signers form DB
const getSigners = () => {
    const query = `SELECT users."firstName", users."lastName", user_profiles.age, user_profiles.city, user_profiles.url
    FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id;`;
    return db.query( query ).then( ( results ) => {
        // console.log( results.rows );
        return results.rows;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

// retrieve all signer from a specified city

const getSignersCity = ( city ) => {
    const query = `SELECT users."firstName", users."lastName", user_profiles.age, user_profiles.url
                FROM users
                JOIN user_profiles
                ON users.id = user_profiles.user_id
                WHERE user_profiles.city = $1;`;
    return db.query( query, [ city ] ).then( ( signersByCity ) => {
        return signersByCity;
    } ).catch( ( err ) => {
        console.error( err.stack );
    } );
};

module.exports.postUser = postUser;
module.exports.putUserAndProfile = putUserAndProfile;
module.exports.getUserAndProfile = getUserAndProfile;

module.exports.postUserProfile = postUserProfile;
module.exports.postSignature = postSignature;
module.exports.getSignature = getSignature;
module.exports.getSigners = getSigners;
module.exports.getSignersCity = getSignersCity;
module.exports.checkUser = checkUser;
