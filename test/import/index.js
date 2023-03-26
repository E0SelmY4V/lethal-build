const { fork } = require('child_process');
require('promise-snake');

Promise.snake(
	['cjs.js', 'esm.mjs', 'ts.js'].map(f =>
		(res, rej) => fork(`${__dirname}/${f}`).on('close', n => (n ? rej : res)(f)),
	)
).then(
	() => process.exit(0),
	(f) => process.exit(-1),
);