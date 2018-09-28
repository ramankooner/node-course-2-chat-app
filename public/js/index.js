var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

  // sent from client to server
  // socket.emit('createMessage', {
  //   from: 'Raman',
  //   text: 'hi!!!'
  // });
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

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

// socket.on('newEmail', function (email) {
//   console.log('New Email', email);
// });

// socket.emit('createMessage', {
//   from: 'frank',
//   text: 'hi'
// }, function (data) {
//   // the data comes from the call back in server.js
//   console.log('Got it.', data);
// });

// e is an event argument
// the e is used to overide the default behavior which causes page to refresh
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
