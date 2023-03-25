declare global {
	var ___mod: {
		cjs: typeof imp;
		esm: typeof initer;
	};
}

import { fnDirname } from 'esm-entry';
import imp from '.';
___mod.cjs = imp;
const initer = fnDirname(imp);
initer.default = initer;
___mod.esm = imp;
export = ___mod;
