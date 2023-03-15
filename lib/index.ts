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
 * @version 1.2.8
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
	export const ignoreList = ['node_modules'];
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
		get ignoreList() {
			return ignoreList;
		}
		set ignoreList(n) {
			ignoreList.length = 0;
			n.forEach(file => ignoreList.push(file));
		}
		walk = async (dir: Will<string> = this.dir, matched: Will<Will<string>[]> = []) => {
			const files = await fsp.readdir(await dir);
			await Promise.thens(files.map(filename => async () => {
				if (ignoreList.includes(filename)) return;
				const filepath = path.join(await dir, filename);
				(await fsp.stat(filepath)).isDirectory() ? await this.walk(filepath, matched) : (await matched).push(filepath);
			}));
			return matched;
		};
		match = async (regWill: Will<RegExp | Will<string>[]>, dir: Will<string> = this.dir) => {
			const reg = await regWill;
			if (!isRegExp(reg)) return reg;
			const allFile = await this.walk(dir);
			const files: string[] = [];
			await Promise.thens(allFile.map(file => async () => reg.test(await file) && files.push(await file)));
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
			await Promise.thens(infos.map(([out, info]) => async () => {
				if (out) {
					const fname = `${this.dir}/temp${++this.tempFileId}`;
					files.push(fname);
					temps.push(fname);
					await fsp.writeFile(fname, await info);
				} else {
					files.push(this.comp(await info, noIgn));
				}
			}));
			await this.mergeOut(files, outs)();
			await this.dels(temps, false)();
		};
		cps = (opns: Will<[Will<string>, Will<string>][]>, noIgn = true) => async () =>
			Promise.thens((await opns).map(([from, to]) => async () => await fsp.cp(this.comp(await from, noIgn), this.comp(await to, noIgn))));
		dels = (files: Will<Will<string>[] | RegExp>, noIgn: boolean | null = null) => async () =>
			Promise.thens((await this.match(files)).map(file => async () => await fsp.unlink(this.comp(await file, noIgn ?? !isRegExp(await files)))));
		exec = (cmd: Will<string>) => () => new Promise<void>(async (todo, ordo) =>
			child_process.exec(await cmd, cbArgs((out, err) => (console.log(out), console.log(err)), todo, ordo))
		);
		judge = (...values: ((() => boolean) | Will<boolean>)[]) => () =>
			Promise.snake(values.map(valueWill => async res => {
				const value = await valueWill;
				if (typeof (value) === 'boolean' ? value : value()) res();
			}));
		snake = (...opns: Will<() => PromiseLike<any>>[]) =>
			Promise.thens(opns.map(opn => async () => await (await opn)()));
		log = <T>(...msgWill: T[]) => async () => {
			const msgs: Awaited<T>[] = [];
			await Promise.thens(msgWill.map(msg => async () => msgs.push(await msg)));
			console.log(...msgs);
		};
		initer = initer;
	};
}
initer.default = initer;
export = initer;
