
/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;
var escape = require('./escape');

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

function Sonar(runner, log) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , self = this;

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
  });

  /**
   * Output tag for the given `test.`
   */

  function test(test) {
    var attrs = {
        classname: process.env.npm_package_config_mocha_sonar_reporter_classname || 'Test'
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