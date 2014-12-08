function Test(title, duration, state, error, file) {
  this.title = title;
  this.duration = duration;
  this.state = state;
  this.error = error;
  if (state === 'pending') {
    this.pending = true;
  }
  this.file = file || '';
}

Test.prototype.slow = function() {
  return 200;
};

module.exports = Test;