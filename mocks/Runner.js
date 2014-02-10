util = require('util');
EventEmitter = require('events').EventEmitter;

function Runner() {}
util.inherits(Runner, EventEmitter);

Runner.prototype.start = function () {
  this.emit('start');
};

Runner.prototype.suite = function (suite) {
  this.emit('suite', suite);
};

Runner.prototype.pending = function (test) {
  this.emit('pending', test);
};

Runner.prototype.pass = function (test) {
  this.emit('pass', test);
};

Runner.prototype.fail = function (test, error) {
  this.emit('fail', test, error);
};

Runner.prototype.testEnd = function (test) {
  this.emit('test end', test);
};

Runner.prototype.end = function () {
  this.emit('end');
};

Runner.prototype.run = function (suite) {
  var self = this;
  self.start();
  self.suite(suite);
  suite.tests.forEach(function (test) {
    switch (test.state) {
      case 'pending':
        self.pending(test);
        self.testEnd(test);
        break;
      case 'passed':
        self.pass(test);
        self.testEnd(test);
        break;
      case 'failed':
        self.fail(test, test.error);
        self.testEnd(test);
        break;
    }
  });
  self.end();
};

module.exports = Runner;