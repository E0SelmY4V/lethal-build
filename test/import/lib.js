const merge = require('deepmerge');
const tests = {
	package() {
		console.log(require.resolve('lethal-build'));
	},
	import() {
		console.log(LBIniter);
	},
	init() {
		globalThis.LB = LBIniter(__dirname);
	},
	logLB() {
		console.log(LB);
	},
	dir() {
		console.log(LB.dir);
	},
};
const cfg = {
	cfg: {
		webpack: {
			path: __dirname + '/../cfg.js',
		},
		ts: {
			// cjsMod: true,
		},
	},
	sign: "LBIniter",
	pack: "lethal-build",
};
module.exports = (gcfg = {}, gtests = {}) => require('export-tester')(
	merge(cfg, gcfg),
	merge(tests, gtests),
).then(({ err }) => process.exit(err));