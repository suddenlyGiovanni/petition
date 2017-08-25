const redis = require( 'redis' );
const client = redis.createClient( process.env.REDIS_URL || {
    host: 'localhost',
    port: 6379
} );

client.on( 'error', function ( err ) {
    console.log( err );
} );

const get = ( key ) => {
    return new Promise( ( resolve, reject ) => {
        client.get( key, ( err, data ) => {
            if ( err ) {
                reject( err );
            }
            resolve( data );
        } );
    } );
};


const set = ( key, value ) => {
    return new Promise( ( resolve, reject ) => {
        client.set( key, value, ( err, data ) => {
            if ( err ) {
                reject( err );
            }
            resolve( data );
        } );
    } );
};

const setex = ( key, expTime, value ) => {
    return new Promise( ( resolve, reject ) => {
        client.setex( key, expTime, value, ( err, data ) => {
            if ( err ) {
                reject( err );
            }
            resolve( data );
        } );
    } );
};





module.exports.get = get;
module.exports.set = set;
module.exports.setex = setex;
