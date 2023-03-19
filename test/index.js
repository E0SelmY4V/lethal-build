/**
 * asd
 * asdsa
 * sd
 */
const LB = require('..')(__dirname);

// LB.snake(
// 	LB.exec('tsc'),
// 	LB.exec('webpack'),
// 	LB.outFS([
// 		[1, '!function(exp){\n\t'],
// 		[0, 'out.js'],
// 		[1, '\n}(window)'],
// 	], 'end.js')
// );

// LB.cps([
// 	['out.js', 'test.js'],
// ]).then((e) => console.log(e));

// LB.dels([
// 	'out.js',
// ]).then((e) => console.log(e));

// scpoProce.snake(
// 	todo => LB.exec('tsc').then(todo),
// 	todo => (console.log(1), todo()),
// ).then(() => console.log(123));

// LB.snake(
// 	() => Promise.resolve(console.log(1)),
// 	LB.judge(() => true),
// 	() => Promise.resolve(console.log(2)),
// )

// LB.walk().then(a => console.log(a))

// LB.match(/test[\\\/]test[\/\\].*js$/).then(e => console.log(e))

// LB.snake(
// 	LB.dels(/test[\\\/]test[\/\\].*js$/),
// 	LB.log('OK.')
// );

// LB.snake(
// 	LB.log(LB.cmt('out.js')),
// 	LB.log(LB.cmt('index.js')),
// 	LB.log(LB.cmt('out.js')),
// );

// LB.snake(
// 	LB.setCmt('index.js'),
// 	LB.log(LB.cmt('out.js')),
// 	LB.log(LB.getCmt())
// );

// LB.cps(['folder/', 'newfolder/'])();

// LB.dels('newfolder')();

// LB.mvs([['newfolder/', 'folder/']])();

// LB.snake(
// 	LB.timeStart('1'),
// 	() => new Promise(res => setTimeout(res, 500)),
// 	LB.timeEnd('1'),
// 	LB.log(LB.time('1')),
// 	LB.timeStart('2'),
// 	() => new Promise(res => setTimeout(res, 300)),
// 	LB.timeEnd('2'),
// 	LB.log(LB.time('2')),
// 	() => new Promise(res => setTimeout(res, 200)),
// 	LB.timeEnd('fromInit'),
// 	LB.log(LB.time('fromInit')),
// );

LB.snake(
	LB.timeStart(),
	LB.timeStart(),
	() => new Promise(res => setTimeout(res, 500)),
	LB.timeEnd(),
	LB.log(LB.time()),
	LB.timeStart(),
	() => new Promise(res => setTimeout(res, 300)),
	LB.timeEnd(),
	LB.log(LB.time()),
	() => new Promise(res => setTimeout(res, 200)),
	LB.timeEnd(),
	LB.log(LB.time()),
	LB.timeEnd(),
	LB.log(LB.time()),
);

// console.log(LB.initer(__dirname) === LB);

// console.log(LB.t('test.js'));