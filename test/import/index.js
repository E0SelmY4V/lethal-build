const { fork } = require('child_process');
const { cp, mkdir } = require('fs/promises');
require('promise-snake');

/**@type {import('fs').CopyOptions} */
const cpCfg = { recursive: true, force: true };
Promise.thens([
	() => mkdir('node_modules/lethal-build/', cpCfg),
	() => cp('build', 'node_modules/lethal-build/build', cpCfg),
	() => cp('package.json', 'node_modules/lethal-build/package.json', cpCfg),
]).snake(
	['cjs.js', 'esm.mjs', 'ts.js'].map(f =>
		(res, rej) => fork(`${__dirname}/${f}`).on('close', n => (n ? rej : res)(f)),
	)
).then(
	() => process.exit(0),
	(f) => process.exit(-1),
);