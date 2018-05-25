// const concat = require('./concat');

module.exports = {
  name: 'mentor-server',
  'middleware.before'() {
    // concat();
  },
  'middleware'() {
    return function *(next) {
      if (this.url.indexOf('/api') > -1) {
        this.body = 'success';
        return;
      }
      yield next;
    };
  },
};
