const exp = require('.');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const initer = Object.assign((dir) => exp(dirname(fileURLToPath(dir))), exp);
initer.default = module.exports = initer;
