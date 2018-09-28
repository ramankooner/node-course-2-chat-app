const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    io.emit('newMessage', generateMessage(message.from, message.text));

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

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
