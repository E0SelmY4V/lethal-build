import { build, wp } from './lib.js';
import merge from 'deepmerge';

/**@type {import('webpack').Configuration} */
const a = {
	entry: build + 'exp.js',
};
export default merge(wp, a);
