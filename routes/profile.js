// ROUTE: --> /profile
const profile = require('express').Router();
const db = require('../modules/dbQuery');

profile.get('/', (req, res, next) => {
    res.render('profile');
});

profile.post('/', (req, res, next) => {
    const user_id = req.session.user_id;
    const age = (req.body.age) ? req.body.age : null;
    const city = (req.body.city) ? req.body.city : null;
    const url = (req.body.url) ? req.body.url : null;
    if (user_id) {
        db.postUserProfile(user_id, age, city, url).then(() =>{
            res.redirect('/petition');
        });
    }
});

module.exports = profile;
