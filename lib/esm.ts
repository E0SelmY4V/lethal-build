import { fnDirname } from 'esm-entry';
import imp from '.'
const initer = fnDirname(imp);
initer.default = initer;
export = initer;
