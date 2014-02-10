function Suite(title) {
  this.title = title;
  this.tests = [];
}

Suite.prototype.fullTitle = function() {
  return this.title;
};

Suite.prototype.addTest = function(test) {
  test.parent = this;
  this.tests.push(test);
};

module.exports = Suite;