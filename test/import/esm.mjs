import tester from 'export-tester';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
).then(({ err }) => process.exit(err));