var chai = require('chai');
chai.should();

var Suite = require('../../mocks/Suite');

describe('Suite', function() {
  describe('#fullTitle', function() {
    it('should return the title provided in the constructor', function() {
      var suite = new Suite('Suite');
      suite.fullTitle().should.equal('Suite');
    })
  });

  describe('#addTest', function() {
    it('should record the test in an array and set the parent property of the test', function() {
      var suite = new Suite();
      test1 = {};
      test2 = {};
      test3 = {};
      suite.addTest(test1);
      suite.addTest(test2);
      suite.addTest(test3);
      suite.tests[0].should.equal(test1)
      suite.tests[1].should.equal(test2)
      suite.tests[2].should.equal(test3)
      test1.parent.should.equal(suite);
      test2.parent.should.equal(suite);
      test3.parent.should.equal(suite);
    });
  });
});
