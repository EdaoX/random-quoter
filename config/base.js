const path = require('path');

module.exports = {
    PORT : process.env.PORT || 3000,
    DATA_FOLDER : path.resolve(__dirname, '../data')
};
