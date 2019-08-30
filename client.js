let WebSocket = require('ws');

function wsWrapper(url) {
  const ws = new WebSocket(url);

  let events = {};

   //Create an event handler
   this.on = function on(event, callback) {
    events[event] = {callback, once: false};
    return this;
  }

  //Create an event handler for one time use
  this.once = function once(event, callback) {
    events[event] = {callback, once: true};
    return this;
  }

  //Emit message to server
  this.emit = function emit(event, data) {
    const payload = JSON.stringify({event, data});
    ws.send(payload);
    return this;
  }

  ws.on('open', () => {
    events['open'].callback(ws);
  });

  ws.on('message', json => {
    const message = JSON.parse(json);

    //Check if event handler exists & check if event is only to be triggered once
    if (events[message.event] && !events[message.event].once) {
      events[message.event].callback(message.data);
    }
    else if (events[message.event] && events[message.event].once) {
      events[message.event].callback(message.data);
      delete events[message.event];
    }
    else {
      return;
    }
  });
}

let socket = new wsWrapper('ws://localhost:4000');

socket.on('open', ws => {
  console.log('connection made');

  socket.emit('poop', {});
});

socket.on('test', data => {
  console.log(data.msg);
})