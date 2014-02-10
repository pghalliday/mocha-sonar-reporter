function Suite() {
  this.tests = [];
}

Suite.prototype.fullTitle = function() {
  return 'suite';
};

Suite.prototype.addTest = function(test) {
  test.parent = this;
  this.tests.push(test);
};

module.exports = Suite;