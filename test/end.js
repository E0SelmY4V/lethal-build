const LB = require('lethal-build')(__dirname);
const { snake, exec, outFS, log, dels } = LB;

// Process chain
snake(
  // Compile
  exec('tsc'),
  // Packing
  exec('webpack'),
  // Assemble
  outFS([
    [1, '!function(exp){'],
    [0, 'packed.js'],
    [1, '}(window)'],
  ], 'main.js'),
  // Clear
  dels([
    'lib/index.js',
    'lib/class.js',
    'packed.js',
  ]),
  // Log
  log('finish.'),
);
