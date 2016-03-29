var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var path = require('path');
var fs = require('fs');
var os = require('os');
chai.should();
chai.use(sinonChai);

var Sonar = require('../../lib/Sonar');
var Runner = require('../../mocks/Runner');
var Suite = require('../../mocks/Suite');
var Test = require('../../mocks/Test');
var escape = require('../../lib/escape');

describe('Sonar', function() {

  afterEach(function () {
    delete process.env.npm_package_config_mocha_sonar_reporter_classname;
    delete process.env.npm_package_config_mocha_sonar_reporter_testdir;
    delete process.env.npm_package_config_mocha_sonar_reporter_outputfile;
  });

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
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="classname" name="Suite Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="classname" name="Suite Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="classname" name="Suite Test 3" time="0.01" message="Test"><failure classname="classname" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should use the configured testdir', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite('Suite');
    var error = new Error('Test');
    var cwd = process.cwd();
    suite.addTest(new Test('Test 1', 10, 'pending', '', path.join(cwd, 'tests', 'foo.js')));
    suite.addTest(new Test('Test 2', 10, 'passed', '', path.join(cwd, 'tests', 'bar/foo.js')));
    suite.addTest(new Test('Test 3', 10, 'failed', error, path.join(cwd, 'tests', 'bar/hello/world.js')));
    process.env.npm_package_config_mocha_sonar_reporter_testdir = 'tests';
    runner.run(suite);
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="foo" name="Suite Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="bar/foo" name="Suite Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="bar/hello/world" name="Suite Test 3" time="0.01" message="Test"><failure classname="bar/hello/world" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should handle an undefined test file when testdir is configured', function() {
    // given
    var logStub = sinon.stub();
    var runner = new Runner();
    var sonar = new Sonar(runner, logStub);
    var suite = new Suite('Suite');
    var error = new Error('Test');

    process.env.npm_package_config_mocha_sonar_reporter_testdir = 'foo';

    suite.addTest(new Test('Test 1', 10, 'failed', error).withUndefinedFile());

    // then
    runner.on('end', function () {
        logStub.callCount.should.equal(3);
        logStub.should.have.been.calledWithMatch(/<testsuite name="Mocha Tests" tests="1" failures="1" errors="1" skipped="0"/);
        logStub.should.have.been.calledWith('<testcase classname="Test" name="Suite Test 1" time="0.01" message="Test"><failure classname="Test" name="Suite Test 1" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
        logStub.should.have.been.calledWith('</testsuite>');
    });

    // when
    runner.run(suite);
  });

  it('should support any file extension', function () {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite('Suite');
    var error = new Error('Test');
    var cwd = process.cwd();
    suite.addTest(new Test('Test 1', 10, 'pending', '', path.join(cwd, 'tests', 'foo.jsx')));
    suite.addTest(new Test('Test 2', 10, 'passed', '', path.join(cwd, 'tests', 'bar/foo.coffee')));
    suite.addTest(new Test('Test 3', 10, 'failed', error, path.join(cwd, 'tests', 'bar/hello/world.cjsx')));
    process.env.npm_package_config_mocha_sonar_reporter_testdir = 'tests';
    runner.run(suite);
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="foo" name="Suite Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="bar/foo" name="Suite Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="bar/hello/world" name="Suite Test 3" time="0.01" message="Test"><failure classname="bar/hello/world" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should support the classnameSuffix option when used with testdir', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite('Suite');
    var error = new Error('Test');
    var cwd = process.cwd();
    suite.addTest(new Test('Test 1', 10, 'pending', '', path.join(cwd, 'tests', 'foo.js')));
    suite.addTest(new Test('Test 2', 10, 'passed', '', path.join(cwd, 'tests', 'bar/foo.js')));
    suite.addTest(new Test('Test 3', 10, 'failed', error, path.join(cwd, 'tests', 'bar/hello/world.js')));
    process.env.npm_package_config_mocha_sonar_reporter_testdir = 'tests';
    process.env.npm_package_config_mocha_sonar_reporter_classnameSuffix = '.suffix';
    runner.run(suite);
    spy.callCount.should.equal(5);
    spy.args[0][0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
    spy.args[1][0].should.equal('<testcase classname="foo.suffix" name="Suite Test 1" time="0.01"><skipped/></testcase>');
    spy.args[2][0].should.equal('<testcase classname="bar/foo.suffix" name="Suite Test 2" time="0.01"/>');
    spy.args[3][0].should.equal('<testcase classname="bar/hello/world.suffix" name="Suite Test 3" time="0.01" message="Test"><failure classname="bar/hello/world.suffix" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase>');
    spy.args[4][0].should.equal('</testsuite>');
  });

  it('should use the configured output file to write output', function(done) {
    var outputFile = path.join(process.cwd(), 'test/output.xml');

    var runner = new Runner();
    var sonar = new Sonar(runner);
    var suite = new Suite('Suite');
    var error = new Error('Test');

    // given
    process.env.npm_package_config_mocha_sonar_reporter_outputfile = 'test/output.xml';

    // first remove the output file
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }

    suite.addTest(new Test('Test 1', 10, 'pending'));
    suite.addTest(new Test('Test 2', 10, 'passed'));
    suite.addTest(new Test('Test 3', 10, 'failed', error));

    // then
    runner.on('end', function() {
      var output = fs.readFileSync(outputFile, 'utf8');
      var lines = output.split('>' + os.EOL);
      lines.length.should.equal(6);
      lines[0].should.match(/<testsuite name="Mocha Tests" tests="3" failures="1" errors="1" skipped="1"/);
      lines[1].should.equal('<testcase classname="Test" name="Suite Test 1" time="0.01"><skipped/></testcase');
      lines[2].should.equal('<testcase classname="Test" name="Suite Test 2" time="0.01"/');
      lines[3].should.equal('<testcase classname="Test" name="Suite Test 3" time="0.01" message="Test"><failure classname="Test" name="Suite Test 3" time="0.01" message="Test"><![CDATA[' + escape(error.stack) + ']]></failure></testcase');
      lines[4].should.equal('</testsuite');

      done();
    });

    // when
    runner.run(suite);
  });
});
