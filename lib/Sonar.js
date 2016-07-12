
/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;
var escape = require('./escape');
var path = require('path');
var fs = require('fs');
var os = require('os');
var mkdirpSync = require('mkdirp').sync;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date;

/**
 * Expose `Sonar`.
 */

exports = module.exports = Sonar;

/**
 * Initialize a new `Sonar` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Sonar(runner, options, log) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , logFd
    , self = this;

  // backward compatibility with old versions of mocha
  if (typeof options === 'function') {
    log = options;
  }

  log = log || console.log;

  runner.on('pending', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    tests.push(test);
  });

  runner.on('fail', function(test){
    tests.push(test);
  });

  runner.on('end', function(){
    log = fileLogger() || log;
    log(tag('testsuite', {
        name: 'Mocha Tests'
      , tests: stats.tests
      , failures: stats.failures
      , errors: stats.failures
      , skipped: stats.tests - stats.failures - stats.passes
      , timestamp: (new Date).toUTCString()
      , time: (stats.duration / 1000) || 0
    }, false));

    tests.forEach(test);
    log('</testsuite>');
    closeFileLogger();
  });

  /**
   * Output tag for the given `test.`
   */

  function test(test) {
    var filename = extractClassName(test);

    var attrs = {
        classname: filename || process.env.npm_package_config_mocha_sonar_reporter_classname || 'Test'
      , name: !test.parent.fullTitle() || test.parent.fullTitle() === '' ? test.title : test.parent.fullTitle() + ' ' + test.title
      , time: (test.duration / 1000) || 0
    };

    if ('failed' == test.state) {
      var err = test.err;
      attrs.message = escape(err.message);
      log(tag('testcase', attrs, false, tag('failure', attrs, false, cdata(err.stack))));
    } else if (test.pending) {
      log(tag('testcase', attrs, false, tag('skipped', {}, true)));
    } else {
      log(tag('testcase', attrs, true) );
    }
  }

  /**
   * Extract the classname (test relative file path) from the test absolute file path
   * @param test
   * @returns classname
   */
  function extractClassName(test) {
    var relativeTestDir = process.env.npm_package_config_mocha_sonar_reporter_testdir;
    var classnameSuffix = process.env.npm_package_config_mocha_sonar_reporter_classnameSuffix || '';

    if (relativeTestDir === undefined || test.file === undefined) {
      return undefined;
    }

    var absoluteTestDir = path.join(process.cwd(), relativeTestDir);

    var relativeFilePath = path.relative(absoluteTestDir, test.file);

    var suffixIndex = relativeFilePath.lastIndexOf('.');

    return (suffixIndex >= 0 ? relativeFilePath.substring(0, suffixIndex) : relativeFilePath) + classnameSuffix;
  }

  function fileLogger() {

    var outputfile = process.env.npm_package_config_mocha_sonar_reporter_outputfile;

    if (!outputfile) {
      return undefined;
    }

    mkdirpSync(path.dirname(outputfile));
    logFd = fs.openSync(outputfile, 'w');

    return function logFile(data) {
      fs.writeSync(logFd, data + os.EOL);
    }
  }

  function closeFileLogger() {
    if (logFd) {
      fs.closeSync(logFd);
    }
  }
}

/**
 * Inherit from `Base.prototype`.
 */

Sonar.prototype.__proto__ = Base.prototype;

/**
 * HTML tag helper.
 */

function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>'
    , pairs = []
    , tag;

  for (var key in attrs) {
    pairs.push(key + '="' + escape(attrs[key]) + '"');
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) tag += content + '</' + name + end;
  return tag;
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}
