var run = require('tape-run');
var browserify = require('browserify');

browserify(__dirname + '/test/index-test.js')
  .bundle()
  .pipe(run())
  .on('results', console.log)
  .pipe(process.stdout);
