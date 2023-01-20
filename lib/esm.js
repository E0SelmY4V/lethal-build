const exp = require('.');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
module.exports = (dir) => exp(dirname(fileURLToPath(dir)));
