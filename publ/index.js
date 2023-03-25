import { dir, temp, opts, publ, build } from './lib.js';
import { transformFileAsync } from '@babel/core';
import * as fsp from 'fs/promises';
import Initer from 'lethal-build';
const {
	snake,
	exec,
	mvs,
	timeEnd,
	time,
	log,
	dels,
	outFS,
	cmt,
	goodReg,
} = Initer(dir);

snake(
	dels('build'),
	exec('npx tsc'),
	exec(`npx webpack -c ${publ}wpcjs.js`),
	async () => {
		const { code } = (await transformFileAsync(temp + 'output', opts));
		await fsp.writeFile(temp + 'exp.plain.js', code);
	},
	outFS([
		[1, `((___mod)=>{`],
		[0, 'temp/exp.plain.js'],
		[1, `})(exports);`]
	], 'temp/exp.js'),
	mvs([
		['build/exp-esm.js', 'temp/exp-esm.js'],
		['build/exp-cjs.js', 'temp/exp-cjs.js'],
	]),
	dels([
		'temp/output',
		'temp/exp.plain.js',
		RegExp(`${goodReg(build)}.*js$`),
	]),
	mvs(['temp', 'build']),
	timeEnd(),
	log('Built in', time(), 'ms'),
	async () => process.exit(0),
);
