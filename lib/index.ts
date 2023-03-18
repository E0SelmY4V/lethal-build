import * as child_process from 'child_process';
import * as events from 'events';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import 'promise-snake';
import * as readline from 'readline';
import Yct from 'you-can-too';
const {
	callback: {
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
	export const isAbs: (fname: string) => boolean = path.sep === '/'
		? (fname) => fname[0] === '/'
		: (fname) => fname[1] === ':';
	export const noSep = (fname: string) => fname.slice(0, fname.at(-1) === '/' || fname.at(-1) === '\\' ? -1 : void 0);
	export const rep: (n: string, f: string, t: string) => string = 'replaceAll' in String.prototype
		? (n, f, t) => (n as any).replaceAll(f, t)
		: (n, f, t) => n.split(f).join(t);
	export const reps = (n: string, f: string[], t: string[]): string => f.length ? reps(rep(n, f.pop()!, t.pop()!), f, t) : n;
	export const regSign: readonly string[] = '+*?[]^()-.${}|,:=!<\\'.split('');
	export const goodReg = (text: string) =>reps(text, regSign.slice(), regSign.map(n => `\\${n}`));
	export class Opn {
		constructor(dir: string) {
			this.dir = dir;
			process.chdir(dir);
		}
		dir: string;
		comp = (fname: string) => isAbs(fname) ? fname : fname ? path.join(this.dir, noSep(fname)) : this.dir;
		compWill = async (fname: Will<string>) => this.comp(await fname);
		file2reg = (fname: string) => RegExp(`^${goodReg(this.comp(fname))}([\\/\\\\].*$|$)`);
		goodReg = goodReg;
		private cmtMem: { [file: string]: string; } = {};
		cmt = async (cmtFile: Will<string>, br = '\n') => {
			const file = this.comp(await cmtFile);
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
		private sigMatch = async (regos: RegExp | string, dir: Will<string> | Will<string>[]) => {
			const allFile = dir instanceof Array ? dir : await this.walk(dir);
			const files: string[] = [];
			const reg = typeof regos === 'string' ? this.file2reg(regos) : regos;
			await Promise.thens(allFile.map(file => async () => reg.test(await file) && files.push(await file)));
			return files;
		};
		match = async (regsWill: Will<RegExp | string | Will<string | RegExp>[]>, dir: Will<string> = this.dir) => {
			const regs = await regsWill;
			if (regs instanceof Array) {
				const files: string[] = [];
				const allFile = await this.walk(dir);
				await Promise.thens(regs.map(n => async () => files.push(...await this.sigMatch(await n, allFile))));
				return files;
			} else return this.sigMatch(regs, dir);
		};
		mergeOut = (files: Will<Will<string>[] | RegExp>, out: fs.WriteStream) => async () =>
			Promise.snake((await this.match(files)).map(file => async res =>
				fs.createReadStream(file).on('end', res).pipe(out, { end: false })
			)).then(() => out.end());
		tempFileId = -1;
		outFS = (infosWill: Will<[0 | 1 | boolean, Will<string>][]>, outWill: Will<string | fs.WriteStream>) => async () => {
			const [infos, out] = [await infosWill, await outWill];
			const files: string[] = [];
			const temps: string[] = [];
			const outs = typeof out === 'string' ? fs.createWriteStream(this.comp(out)) : out;
			await Promise.thens(infos.map(([out, info]) => async () => {
				if (out) {
					const fname = `${this.dir}/temp${++this.tempFileId}`;
					files.push(fname);
					temps.push(fname);
					await fsp.writeFile(fname, await info);
				} else {
					files.push(this.comp(await info));
				}
			}));
			await this.mergeOut(files, outs)();
			await this.dels(temps)();
		};
		cps = (opns: Will<Will<[Will<string>, Will<string>]>[] | [Will<string>, Will<string>]>) => async () =>
			Promise.thens((await opns).map(nWill => async () => {
				const n = await nWill;
				if (typeof n === 'string') throw await opns;
				await fsp.cp(this.comp(await n[0]), this.comp(await n[1]), { recursive: true });
			})).catch(async ([a, b]: Will<string>[]) => fsp.cp(this.comp(await a), this.comp(await b), { recursive: true }));
		dels = (files: Will<Will<string | RegExp>[] | RegExp | string>) => async () =>
			Promise.thens((await this.match(files)).map(file => async () => await fsp.unlink(this.comp(file))));
		mvs = (opnsWill: Will<Will<[Will<string>, Will<string>]>[] | [Will<string>, Will<string>]>) => async () => {
			await this.cps(opnsWill)();
			const mayStr = await (await opnsWill)[0];
			if (typeof mayStr === 'string') return this.dels(mayStr)();
			const opns = await opnsWill as Will<[Will<string>, Will<string>]>[];
			const dos: string[] = [];
			await Promise.thens(opns.map(opn => async () => dos.push(await (await opn)[0])));
			await this.dels(dos)();
		};
		mkdir = (dir: Will<string> | Will<Will<string>[]>) => async () => {
			const adir = await dir;
			const dirs = typeof adir === 'string' ? [adir] : adir;
			await Promise.thens(dirs.map(n => async () => fsp.mkdir(await n, { recursive: true })));
		};
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
