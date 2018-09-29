const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

  // this alerts every user except for the one who joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // we are creating the event
  // sent from server to client
  // socket.emit('newMessage', {
  //   from: 'Mike',
  //   text: 'See you soon!',
  //   createdAt: 12
  // });

  // socket.emit('newEmail', {
  //   from: 'raman@example.com',
  //   text: 'Hello!',
  //   createAt: 123
  // });

  // we use the callback here as an acknowledgement
  // acknowledgements will send data back to the client like a success message
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
    // sends event to everyone except this socket
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });
  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });


  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
