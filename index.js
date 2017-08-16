/*
    ENTRY POINT
*/

const cluster = require( 'cluster' );
const os = require( 'os' );

// Setting up a CLUSTER to create multiple instances of the node server:
// 1. to speared the load on multiple CPUs
// 2. to increase reliability

// setting up MAIN node module for the cluster
cluster.setupMaster( {
    exec: __dirname + '/app.js'
} );


for ( var i = 0, l = os.cpus().length; i < l; i++ ) {
    // setting up as many WORKERS PROCESS as physical CPUs thread are available..
    cluster.fork();
}

// if a process dies due to an error, a new process will start.
cluster.on( 'exit', function ( worker ) {
    console.log( worker.process.pid + ' bit the dust' );
    cluster.fork();
} );
