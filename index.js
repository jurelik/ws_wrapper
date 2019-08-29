let WebSocket = require('ws');
let uuidv4 = require('uuid/v4');

function wsWrapper() {
  //Init server
  const wss = new WebSocket.Server({
    port: 4000,
    clientTracking: true
  }, () => {
    console.log('Server up and running.');
  });

  let ws;
  let events = {};
  
  wss.on('connection', ws => {
    ws.id = uuidv4();

    console.log('connection made');

    ws.on('message', json => {
      const message = JSON.parse(json);
  
      if (!events[message.event]) {
        return;
      }
      else {
        events[message.event](message.data);
      }
    });
  });

  //Create an event handler
  this.on = function on(event, callback) {
    events[event] = callback;
    return this;
  }

  //Emit message to socket
  this.emit = function emit(event, data) {
    //Check type
    if (typeof event != 'string' || typeof data != 'object') {
      throw new TypeError('event must be a string, data must be an object');
    }

    const payload = JSON.stringify({event, data});
    ws.send(payload);
    return this;
  }
}

const socket = new wsWrapper();

socket.on('poop', data => {
  console.log(data.msg);
})