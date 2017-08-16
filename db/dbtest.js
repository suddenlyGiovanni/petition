const spicedPg = require('spiced-pg');
const secrets = require('./secrets');

var db = spicedPg(`postgres:${secrets.dbUser}:${secrets.dbPass}@localhost:5432/cities`);

var universe ='DC';
var id = 'id';

db.query('SELECT * FROM cities = $1 AND  id = $2' , [
    universe,
    id
]).then(function(results) {
    console.log(results.rows);
}).catch(function(err) {
    console.log(err);
});
