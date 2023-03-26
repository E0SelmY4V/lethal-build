const tester = require('export-tester');

tester(
	{
		sign: "LB",
		pack: "lethal-build",
		cfg: {
			ts: {
				// cjsMod: true,
			},
		},
		req: ['ts']
	},
	{
		import() {
			console.log(LB);
		},
		init() {
			console.log(LB(__dirname));
		},
		dir() {
			console.log(LB(__dirname).dir);
		},
	}
).then(({ err }) => process.exit(err));