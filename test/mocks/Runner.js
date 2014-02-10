var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Runner = require('../../mocks/Runner');

describe('Runner', function() {
  describe('#start', function() {
    it('should emit a start event', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('start', spy);
      runner.start();
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql([]);
    });
  });

  describe('#suite', function() {
    it('should emit a suite event with the given suite', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('suite', spy);
      runner.suite('suite');
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql(['suite']);
    });
  });

  describe('#pending', function() {
    it('should emit a pending event with the given test', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('pending', spy);
      runner.pending('test');
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql(['test']);
    });
  });

  describe('#pass', function() {
    it('should emit a pass event with the given test', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('pass', spy);
      runner.pass('test');
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql(['test']);
    });
  });

  describe('#fail', function() {
    it('should emit a fail event with the given test and the error', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('fail', spy);
      runner.fail('test', 'error');
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql(['test', 'error']);
    });
  });

  describe('#testEnd', function() {
    it('should emit a test end event with the given test', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('test end', spy);
      runner.testEnd('test');
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql(['test']);
    });
  });

  describe('#end', function() {
    it('should emit an end event', function() {
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('end', spy);
      runner.end();
      spy.should.have.been.calledOnce;
      spy.args[0].should.eql([]);
    });
  });

  describe('#run', function() {
    it('should emit events in the correct sequence', function() {
      var test1 = {
        state: 'pending',
      };
      var test2 = {
        state: 'passed',
      };
      var test3 = {
        state: 'failed',
        error: 'error'
      };
      var suite = {
        tests: [
          test1,
          test2,
          test3
        ]
      };
      var runner = new Runner();
      var spy = sinon.spy();
      runner.on('start', spy.bind(null, 'start'));
      runner.on('suite', spy.bind(null, 'suite'));
      runner.on('pending', spy.bind(null, 'pending'));
      runner.on('pass', spy.bind(null, 'pass'));
      runner.on('fail', spy.bind(null, 'fail'));
      runner.on('test end', spy.bind(null, 'test end'));
      runner.on('end', spy.bind(null, 'end'));
      runner.run(suite);
      spy.callCount.should.equal(9);
      spy.args[0].should.eql(['start']);
      spy.args[1].should.eql(['suite', suite]);
      spy.args[2].should.eql(['pending', test1]);
      spy.args[3].should.eql(['test end', test1]);
      spy.args[4].should.eql(['pass', test2]);
      spy.args[5].should.eql(['test end', test2]);
      spy.args[6].should.eql(['fail', test3, 'error']);
      spy.args[7].should.eql(['test end', test3]);
      spy.args[8].should.eql(['end']);
    });
  });
});
