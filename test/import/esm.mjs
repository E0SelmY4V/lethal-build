import tester from 'export-tester';
import LBIniter from 'lethal-build';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
console.log(LBIniter)
const LB = LBIniter(import.meta.url);

tester(
	{
		sign: "LB",
		pack: "lethal-build",
		cfg: {
			webpack: {
				path: dirname(fileURLToPath(import.meta.url)) + '/../cfg.js',
			},
		},
		req: ['node-esm', 'webpack-esm']
	},
	{
		import() {
			console.log(LB);
		},
		init() {
			console.log(LB(import.meta.url));
		},
		dir() {
			console.log(LB(import.meta.url).dir);
		},
	}
);