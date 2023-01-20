import * as fs from 'fs';
import type { Proce, ProceN } from 'scpo-proce';
import scpoProce = require('scpo-proce');
import * as child_process from 'child_process'

/**
 * Lethal Build
 * @version 1.1.0
 * @license WTFPL
 * @link https://github.com/E0SelmY4V/lethal-build
 */
export = (dir: string) => new Opn(dir);
class Opn {
	constructor(dir: string) {
		this.dir = dir;
	}
	dir = '';
	t = (n: string, d = true) => d ? n ? (this.dir + '/' + n) : this.dir : n;
	mergeOut = (list: string[], out: fs.WriteStream) => () =>
		scpoProce.snake(list.map(e => (todo: () => void) =>
			fs.createReadStream(e).on('end', todo).pipe(out, { end: false })
		)).then(() => out.end());
	tid = -1;
	outFS = (k: [0 | 1 | boolean, string][], out: string | fs.WriteStream, d = true) => () => {
		const files: string[] = [], temps: string[] = [];
		const outs = typeof out === 'string' ? fs.createWriteStream(this.t(out, d)) : out;
		return scpoProce
			.snake(k.map(e => todo => {
				if (e[0]) {
					const fname = `${this.dir}/temp${++this.tid}`;
					files.push(fname), temps.push(fname);
					fs.writeFile(fname, e[1], todo);
				} else files.push(this.t(e[1], d)), todo();
			}))
			.then(this.mergeOut(files, outs))
			.take(this.dels(temps, false), void 0, 1)
			.take(1);
	}
	cps = (p: [string, string][], d = true) => (): Proce<[]> =>
		scpoProce.snake(p.map(e => todo => (fs.cp(this.t(e[0], d), this.t(e[1], d), todo))));
	dels = (p: string[], d = true) => (): Proce<[]> =>
		scpoProce.snake(p.map(e => todo => fs.unlink(this.t(e, d), todo)));
	exec = (cmd: string) => (): Proce<[], [child_process.ExecException]> => scpoProce.snake(
		todo => child_process.exec(cmd, todo),
		(todo, ordo, err, stdout, stderr) => (console.log(stdout), console.log(stderr), err ? ordo : todo)(err),
	);
	judge = (...l: boolean[]) => () => scpoProce.snake(l.map(e => e ? _ => _() : _ => _));
	snake = (...t: (() => ProceN)[]) => scpoProce.snake(t.map(e => todo => e().then(todo)));
	log = (...msg: any[]) => () => scpoProce((console.log(...msg), false));
};
