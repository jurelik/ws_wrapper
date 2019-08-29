let WebSocket = require('ws');

function wsWrapper() {
  const ws = new WebSocket('ws://localhost:4000');

  let events = {};

  this.emit = function emit(event, data) {
    const payload = JSON.stringify({event, data});
    ws.send(payload);
    return this;
  }

  this.on = function on(event, callback) {
    events[event] = callback;
    return this;
  }
  
  ws.on('open', () => {
    events['open'](ws);
  });

  ws.on('message', json => {
    const message = JSON.parse(json);

    if (!events[message.event]) {
      return;
    }
    else {
      events[message.event](message.data);
    }
  });
}

let socket = new wsWrapper();

socket.on('open', ws => {
  console.log('connection made');
  socket.emit('poop', {msg: 'heh'});
})

setTimeout(() => {
//
}, 10000);
