const { fork } = require('child_process');
require('promise-snake');

Promise.snake([
	res => fork(__dirname + '/cjs.js').on('close', res),
	res => fork(__dirname + '/esm.mjs').on('close', res),
	res => fork(__dirname + '/ts.js').on('close', res),
]).then(() => process.exit(0));