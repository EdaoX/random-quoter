const base = require('./base');

const env = (process.env.NODE_ENV === 'development') ? require('./dev.js') : require('./prod.js');

module.exports = Object.assign({}, base, env);
