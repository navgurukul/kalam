const EventEmitter = {
  events: {},
  dispatch: function (event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  },
  subscribe: function (event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  unsubscribe: function (event) {
    if (this.events[event]) this.events[event] = [];
  },
};

module.exports = { EventEmitter };
