// checkSession.js

const checkIfSigned = ( req, res, next ) => {
    if ( req.session.signatureId ) {
        res.redirect( '/petition/signed' );
    } else {
        next();
    }
};

const checkIfNotSigned = ( req, res, next ) => {
    if ( !req.session.signatureId ) {
        res.redirect( '/petition' );
    } else {
        next();
    }
};

module.exports = checkIfSigned;
module.exports = checkIfNotSigned;
