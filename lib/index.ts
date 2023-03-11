import * as fs from 'fs';
import 'promise-snake';
import * as child_process from 'child_process';

/**
 * Lethal Build
 * @version 1.1.1
 * @license GPL-3.0-or-later
 * @link https://github.com/E0SelmY4V/lethal-build
 */
function initer(dir: string) {
	return initer.OpnList[dir] || (initer.OpnList[dir] = new initer.Opn(dir));
}
namespace initer {
	const giveAndDo = <T>(n: (...arg: any[]) => T) => n();
	const giveAndReturn = <T>(n: T) => n;
	const cbNoArg = <T>(res: () => any, rej: (err: T) => any) => (err: T) => err === null ? res() : rej(err);
	const cbOneArg = <T, N>(res: (n: N) => any, rej: (err: T) => any) => (err: T, n: N) => err === null ? res(n) : rej(err);
	const cbArgs = <T, N extends any[]>(hdl: (...arg: N) => any, res: () => any, rej: (err: T) => any) => (err: T, ...arg: N) => err === null ? (hdl(...arg), res()) : rej(err);
	export const OpnList: { [dir: string]: Opn; } = {};
	export class Opn {
		constructor(dir: string) {
			this.dir = dir;
			process.chdir(dir);
		}
		dir: string;
		comp = (fname: string, noIgn = true) => noIgn ? fname ? (this.dir + '/' + fname) : this.dir : fname;
		t = this.comp;
		mergeOut = (files: string[], out: fs.WriteStream) => () =>
			Promise.snake(files.map(file => res =>
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
		dels = (files: string[], noIgn = true) => () =>
			Promise.snake(files.map(file => (res, rej) => fs.unlink(this.comp(file, noIgn), cbNoArg(res, rej))));
		exec = (cmd: string) => () => new Promise<void>((todo, ordo) =>
			child_process.exec(cmd, cbArgs((out, err) => (console.log(out), console.log(err)), todo, ordo))
		);
		judge = (...values: boolean[]) => () => Promise.snake(values.map(value => value ? giveAndDo : giveAndReturn));
		snake = (...opns: (() => PromiseLike<any>)[]) => Promise.snake(opns.map(opn => todo => opn().then(todo)));
		log = (...msg: any[]) => async () => (console.log(...msg), false);
		initer = initer;
	};
}
initer.default = initer;
export = initer;
