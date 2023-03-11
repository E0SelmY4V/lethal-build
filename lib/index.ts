import * as fs from 'fs';
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
 * @version 1.1.1
 * @license GPL-3.0-or-later
 * @link https://github.com/E0SelmY4V/lethal-build
 */
function initer(dir: string) {
	return initer.OpnList[dir] || (initer.OpnList[dir] = new initer.Opn(dir));
}
namespace initer {
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
