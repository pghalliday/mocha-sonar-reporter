var chai = require('chai');
var should = chai.should();

var Test = require('../../mocks/Test');

describe('Test', function() {
  it('should instantiate with the given parent, title, duration, state and error', function() {
    var test = new Test('test', 10, 'fail', 'error');
    test.title.should.equal('test');
    test.duration.should.equal(10);
    test.state.should.equal('fail');
    test.error.should.equal('error');
  });

  it('should set the pending property if the state is pending', function() {
    var test = new Test('test', 10, 'pending');
    test.pending.should.be.true;
  });

  describe('#slow', function() {
    it('should return 200', function() {
      var test = new Test();
      test.slow().should.equal(200);
    });
  });

  describe('#withEmptyFile', function() {
    it('should return the test and set the file to undefined', function() {
      // when
      var test = new Test().withUndefinedFile();

      // then
      should.equal(test.file, undefined);
    });
  });
});
