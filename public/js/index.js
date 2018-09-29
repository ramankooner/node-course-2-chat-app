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

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    // blank makes us open up the link in a new tab
    var a = jQuery('<a target = "_blank">My current location</a>')

    li.text(`${message.from}: `);
    // sets href to the url
    a.attr('href', message.url);
    li.append(a);
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

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your brower.')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location');
  });
});
