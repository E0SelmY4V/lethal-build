import { join } from 'path';
import { getDirname } from 'esm-entry';

export const publ = join(getDirname(import.meta.url), '/');
export const dir = join(publ, '../');
export const build = join(dir, 'build/');
export const temp = join(dir, 'temp/');
/**@type {import('webpack').Configuration} */
export const wp = {
	output: {
		path: temp,
		filename: 'output',
	},
	mode: 'production',
	target: 'node',
};
/**@type {import('@babel/core').ParserOptions} */
export const opts = {
	presets: [
		"@babel/preset-env",
	],
};
