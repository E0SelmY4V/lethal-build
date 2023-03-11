import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import 'promise-snake';
import Yct from 'you-can-too';
import * as child_process from 'child_process';
const {
	callback: {
		giveAndDo,
		giveAndReturn,
		cbNoArg,
		cbArgs,
	},
} = Yct;

/**
 * Lethal Build
 * @version 1.2.0
 * @license GPL-3.0-or-later
 * @link https://github.com/E0SelmY4V/lethal-build
 */
function initer(dir: string) {
	return initer.OpnList[dir] || (initer.OpnList[dir] = new initer.Opn(dir));
}
namespace initer {
	export const OpnList: { [dir: string]: Opn; } = {};
	export const isRegExp = (n: RegExp | readonly any[]): n is RegExp => 'flags' in n;
	export class Opn {
		constructor(dir: string) {
			this.dir = dir;
			process.chdir(dir);
		}
		dir: string;
		comp = (fname: string, noIgn = true) => noIgn ? fname ? (this.dir + '/' + fname) : this.dir : fname;
		t = this.comp;
		walk = async (dir = this.dir, matched: string[] = []) => {
			const files = await fsp.readdir(dir);
			await Promise.snake(files.map(filename => async (res) => {
				const filepath = path.join(dir, filename);
				(await fsp.stat(filepath)).isDirectory() ? await this.walk(filepath, matched) : matched.push(filepath);
				return res();
			}));
			return matched;
		};
		match = async (reg: RegExp | string[], dir = this.dir) => {
			if (!isRegExp(reg)) return reg;
			const allFile = await this.walk(dir);
			const files: string[] = [];
			allFile.forEach(file => reg.test(file) && files.push(file));
			return files;
		};
		mergeOut = (files: string[] | RegExp, out: fs.WriteStream) => async () =>
			Promise.snake((await this.match(files)).map(file => res =>
				fs.createReadStream(file).on('end', res).pipe(out, { end: false })
			)).then(() => out.end());
		tempFileId = -1;
		outFS = (infos: [0 | 1 | boolean, string][], out: string | fs.WriteStream, noIgn = true) => () => {
			const files: string[] = [];
			const temps: string[] = [];
			const outs = typeof out === 'string' ? fs.createWriteStream(this.comp(out, noIgn)) : out;
			return Promise
				.snake(infos.map(([out, info]) => (res, rej) => {
					if (out) {
						const fname = `${this.dir}/temp${++this.tempFileId}`;
						files.push(fname);
						temps.push(fname);
						fs.writeFile(fname, info, cbNoArg(res, rej));
					} else {
						files.push(this.comp(info, noIgn));
						res();
					}
				}))
				.then(this.mergeOut(files, outs))
				.then(this.dels(temps, false));
		};
		cps = (opns: [string, string][], noIgn = true) => () =>
			Promise.snake(opns.map(([from, to]) => (res, rej) => (fs.cp(this.comp(from, noIgn), this.comp(to, noIgn), cbNoArg(res, rej)))));
		dels = (files: string[] | RegExp, noIgn = !isRegExp(files)) => async () =>
			Promise.snake((await this.match(files)).map(file => (res, rej) => fs.unlink(this.comp(file, noIgn), cbNoArg(res, rej))));
		exec = (cmd: string) => () => new Promise<void>((todo, ordo) =>
			child_process.exec(cmd, cbArgs((out, err) => (console.log(out), console.log(err)), todo, ordo))
		);
		judge = (...values: ((() => boolean) | boolean)[]) => () =>
			Promise.snake(values.map(value => (typeof value === 'boolean' ? value : value()) ? giveAndDo : giveAndReturn));
		snake = (...opns: (() => PromiseLike<any>)[]) =>
			Promise.snake(opns.map(opn => todo => opn().then(todo)));
		log = (...msg: any[]) => async () => (console.log(...msg), false);
		initer = initer;
	};
}
initer.default = initer;
export = initer;
