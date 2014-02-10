var chai = require('chai');
chai.should();

var escape = require('../../lib/escape');

describe('escape', function() {
  it('should html escape &, ", < and >', function() {
    escape('&"<>').should.equal('&amp;&quot;&lt;&gt;');
  });
});
