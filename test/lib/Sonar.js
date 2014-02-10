var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Sonar = require('../../lib/Sonar');
var Runner = require('../../mocks/Runner');
var Suite = require('../../mocks/Suite');
var Test = require('../../mocks/Test');
var escape = require('../../lib/escape');

describe('Sonar', function() {
  it('should output with the correct classnames and test results', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite('Suite');
    var error = new Error('Test');
    suite.addTest(new Test('Test 1', 10, 'pending'));
    suite.addTest(new Test('Test 2', 10, 'passed'));
    suite.addTest(new Test('Test 3', 10, 'failed', error));
    runner.run(suite);
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="Test" name="Suite Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="Test" name="Suite Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="Test" name="Suite Test 3" time="0.01" message="Test"><failure classname="Test" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should output with the correct classnames and test results when a suite name is empty', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite('');
    var error = new Error('Test');
    suite.addTest(new Test('Test 1', 10, 'pending'));
    suite.addTest(new Test('Test 2', 10, 'passed'));
    suite.addTest(new Test('Test 3', 10, 'failed', error));
    runner.run(suite);
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="Test" name="Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="Test" name="Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="Test" name="Test 3" time="0.01" message="Test"><failure classname="Test" name="Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should output with the correct classnames and test results when a suite name is undefined', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite();
    var error = new Error('Test');
    suite.addTest(new Test('Test 1', 10, 'pending'));
    suite.addTest(new Test('Test 2', 10, 'passed'));
    suite.addTest(new Test('Test 3', 10, 'failed', error));
    runner.run(suite);
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="Test" name="Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="Test" name="Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="Test" name="Test 3" time="0.01" message="Test"><failure classname="Test" name="Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should use the configured classname', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite('Suite');
    var error = new Error('Test');
    suite.addTest(new Test('Test 1', 10, 'pending'));
    suite.addTest(new Test('Test 2', 10, 'passed'));
    suite.addTest(new Test('Test 3', 10, 'failed', error));
    process.env.npm_package_config_mocha_sonar_reporter_classname = 'classname';
    runner.run(suite);
    process.env.npm_package_config_mocha_sonar_reporter_classname = undefined;
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="classname" name="Suite Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="classname" name="Suite Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="classname" name="Suite Test 3" time="0.01" message="Test"><failure classname="classname" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });
});
