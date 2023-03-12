import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as events from 'events';
import * as readline from 'readline';
import 'promise-snake';
import Yct from 'you-can-too';
import * as child_process from 'child_process';
const {
	callback: {
		cbNoArg,
		cbArgs,
	},
} = Yct;

/**
 * Lethal Build
 * @version 1.2.6
 * @license GPL-3.0-or-later
 * @link https://github.com/E0SelmY4V/lethal-build
 */
function initer(dir: string) {
	return initer.OpnList[dir] || (initer.OpnList[dir] = new initer.Opn(dir));
}
namespace initer {
	export type Will<T> = T | PromiseLike<T>;
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
		private cmtMem: { [file: string]: string; } = {};
		cmt = async (cmtFile: Will<string>, { br = '\n', noIgn = true } = {}) => {
			const file = this.comp(await cmtFile, noIgn);
			if (file in this.cmtMem) return this.cmtMem[file];
			const cmtArr: string[] = [];
			let cb = (input: string) => input[0] === ' ' || input[0] === '/' ? cmtArr.push(input) : (inter.removeAllListeners('line'), cmtArr.push(''));
			const inter = readline.createInterface(fs.createReadStream(file)).on('line', cb);
			await events.once(inter, 'close');
			return this.cmtMem[file] = cmtArr.join(br);
		};
		walk = async (dir: Will<string> = this.dir, matched: Will<Will<string>[]> = []) => {
			const files = await fsp.readdir(await dir);
			await Promise.snake(files.map(filename => async (res) => {
				const filepath = path.join(await dir, filename);
				(await fsp.stat(filepath)).isDirectory() ? await this.walk(filepath, matched) : (await matched).push(filepath);
				return res();
			}));
			return matched;
		};
		match = async (regWill: Will<RegExp | Will<string>[]>, dir: Will<string> = this.dir) => {
			const reg = await regWill;
			if (!isRegExp(reg)) return reg;
			const allFile = await this.walk(dir);
			const files: string[] = [];
			await Promise.snake(allFile.map(file => async res => (reg.test(await file) && files.push(await file), res())));
			return files;
		};
		mergeOut = (files: Will<Will<string>[] | RegExp>, out: fs.WriteStream) => async () =>
			Promise.snake((await this.match(files)).map(file => async res =>
				fs.createReadStream(await file).on('end', res).pipe(out, { end: false })
			)).then(() => out.end());
		tempFileId = -1;
		outFS = (infosWill: Will<[0 | 1 | boolean, Will<string>][]>, outWill: Will<string | fs.WriteStream>, noIgn = true) => async () => {
			const [infos, out] = [await infosWill, await outWill];
			const files: string[] = [];
			const temps: string[] = [];
			const outs = typeof out === 'string' ? fs.createWriteStream(this.comp(out, noIgn)) : out;
			await Promise.snake(infos.map(([out, info]) => async (res, rej) => {
				if (out) {
					const fname = `${this.dir}/temp${++this.tempFileId}`;
					files.push(fname);
					temps.push(fname);
					fs.writeFile(fname, await info, cbNoArg(res, rej));
				} else {
					files.push(this.comp(await info, noIgn));
					res();
				}
			}));
			await this.mergeOut(files, outs)();
			await this.dels(temps, false)();
		};
		cps = (opns: Will<[Will<string>, Will<string>][]>, noIgn = true) => async () =>
			Promise.snake((await opns).map(([from, to]) => async (res, rej) => (fs.cp(this.comp(await from, noIgn), this.comp(await to, noIgn), cbNoArg(res, rej)))));
		dels = (files: Will<Will<string>[] | RegExp>, noIgn: boolean | null = null) => async () =>
			Promise.snake((await this.match(files)).map(file => async (res, rej) => fs.unlink(this.comp(await file, noIgn ?? !isRegExp(await files)), cbNoArg(res, rej))));
		exec = (cmd: Will<string>) => () => new Promise<void>(async (todo, ordo) =>
			child_process.exec(await cmd, cbArgs((out, err) => (console.log(out), console.log(err)), todo, ordo))
		);
		judge = (...values: ((() => boolean) | Will<boolean>)[]) => () =>
			Promise.snake(values.map(valueWill => async res => {
				const value = await valueWill;
				if (typeof (value) === 'boolean' ? value : value()) res();
			}));
		snake = (...opns: Will<() => PromiseLike<any>>[]) =>
			Promise.snake(opns.map(opn => async todo => (await opn)().then(todo)));
		log = <T>(...msgWill: T[]) => async () => {
			const msgs: Awaited<T>[] = [];
			await Promise.snake(msgWill.map(msg => async res => (msgs.push(await msg), res())));
			console.log(...msgs);
		};
		initer = initer;
	};
}
initer.default = initer;
export = initer;
