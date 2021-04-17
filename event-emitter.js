const events = require('events');
const eventEmitter = new events.EventEmitter();
const eventListener = function () {
  console.log('event triggered');
};

eventEmitter.on('emitted', eventListener);
eventEmitter.emit('emitted');
