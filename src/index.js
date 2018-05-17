module.exports = {
  name: 'mentor-server',
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
