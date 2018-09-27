var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

  // SERVER
  socket.emit('createMessage', {
    from: 'Raman',
    text: 'hi!!!'
  });
  // socket.emit('createEmail', {
  //   to: 'ram@example.com',
  //   text: 'Hello this is Raman'
  // });
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

// socket.on('newEmail', function (email) {
//   console.log('New Email', email);
// });
