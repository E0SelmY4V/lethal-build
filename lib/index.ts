import * as fs from 'fs';
import type { Proce } from 'scpo-proce';
import scpoProce = require('scpo-proce');

/**
 * Lethal Build
 * @version 0.9.0
 * @license WTFPL
 * @link https://github.com/E0SelmY4V/lethal-build
 */
export = (dir: string) => new Opn(dir);
class Opn {
	constructor(dir: string) {
		this.dir = dir;
	}
	dir = '';
	t(n: string, d = true) {
		return d ? n ? (__dirname + '/' + n) : __dirname : n;
	}
	mergeOut(list: string[], out: fs.WriteStream) {
		return scpoProce.snake(list.map(e => (todo: () => void) =>
			fs.createReadStream(e).on('end', todo).pipe(out, { end: false })
		)).then(() => out.end());
	}
	tid = -1;
	outFS(k: [0 | 1 | boolean, string][], out: string | fs.WriteStream, d = true) {
		const files: string[] = [], temps: string[] = [];
		const outs = typeof out === 'string' ? fs.createWriteStream(this.t(out, d)) : out;
		return scpoProce
			.snake(k.reverse().map(e => todo => {
				if (e[0]) {
					const fname = `${__dirname}/temp${++this.tid}`;
					files.push(fname), temps.push(fname);
					fs.writeFile(fname, e[1], todo);
				} else files.push(this.t(e[1], d)), todo();
			}))
			.then(() => this.mergeOut(files, outs))
			.take(() => this.dels(temps, false))
			.take(1);
	}
	cps(p: [string, string][], d = true): Proce<[]> {
		return scpoProce.snake(p.map(e => todo => (fs.cp(this.t(e[0], d), this.t(e[1], d), todo))));
	}
	dels(p: string[], d = true): Proce<[]> {
		return scpoProce.snake(p.map(e => todo => fs.unlink(this.t(e, d), todo)));
	}
};
