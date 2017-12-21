const { BASE_URL } = require('../config/config');

const compose = ( path ) => {

    if(!path.startsWith('/'))
        path = `/${path}`;

    return `${BASE_URL}${path}`;

};

const urlCompose = (req, res, next) => {

    res.locals.url = compose;
    next();

};

module.exports = urlCompose;
