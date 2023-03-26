const tester = require('export-tester');

tester(
	{
		sign: "LB",
		pack: "lethal-build",
		cfg: {
			webpack: {
				path: __dirname + '/../cfg.js',
			},
		},
		req: ['node-cjs', 'webpack-cjs']
	},
	{
		import() {
			console.log(LB);
		},
		init() {
			console.log(LB(__dirname));
		},
	}
).then(({ err }) => process.exit(err));