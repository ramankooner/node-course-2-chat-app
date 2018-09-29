const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.')
    }

    // emit chat messages to other people in same Room
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);


    // socket.leave('Office') leaves the room

    // socket.emit - emits to one specific users
    // socket.broadcast.emit - emits to everyone except that users
    // io.emit - emits to everyone
    // io.to('office').emit // this sends event to everyone in a room
    // socket.broadcast.to('office').emit // sends event to everyone in office roome except for user

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

    // this alerts every user except for the one who joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });
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
  });
  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });


  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    // if user was removed
    if (user) {
      // this will remove a user when they leave the room
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
    //console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
