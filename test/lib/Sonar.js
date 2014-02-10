var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Sonar = require('../../lib/Sonar');
var Runner = require('../../mocks/Runner');
var Suite = require('../../mocks/Suite');
var Test = require('../../mocks/Test');

describe('Sonar', function() {
  it('should output with the correct classnames and test results', function() {
    var spy = sinon.spy();
    var runner = new Runner();
    var sonar = new Sonar(runner, spy);
    var suite = new Suite();
    suite.addTest(new Test('Test 1', 10, 'pending'));
    suite.addTest(new Test('Test 2', 10, 'passed'));
    suite.addTest(new Test('Test 3', 10, 'failed', new Error('Test')));
    runner.run(suite);
    spy.callCount.should.equal(5);
  });
});
