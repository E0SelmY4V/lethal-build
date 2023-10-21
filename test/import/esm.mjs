import tester from './lib.js';

tester(
	{
		req: ['node-esm', 'webpack-esm']
	},
	{
		package() {
			console.log(import.meta.resolve?.('lethal-build'));
		},
		init() {
			globalThis.LB = LBIniter(import.meta.url);
		},
	},
);
