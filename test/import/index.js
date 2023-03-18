const tester = require('export-tester');
const { fork } = require('child_process');

Promise.resolve().then(
	() => new Promise(res => fork(__dirname + '/cjs.js').on('close', res))
).then(
	() => new Promise(res => fork(__dirname + '/esm.mjs').on('close', res))
).then(
	() => new Promise(res => fork(__dirname + '/ts.js').on('close', res))
);