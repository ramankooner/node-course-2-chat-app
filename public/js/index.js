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
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

  // var li = jQuery('<li></li>');
  // li.text(`${formattedTime} ${message.from}: ${message.text}`);
  //
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {

    var formattedTime = moment(message.createdAt).format('h:mm a');
    //var li = jQuery('<li></li>');
    // blank makes us open up the link in a new tab
    //var a = jQuery('<a target = "_blank">My current location</a>')

    //li.text(`${formattedTime} ${message.from}: `);
    // sets href to the url
  //  a.attr('href', message.url);
  //  li.append(a);
  //  jQuery('#messages').append(li);
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    });
    jQuery('#messages').append(html);
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

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    // this clears the message after we send it
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your brower.')
  }

  // Disables button
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    // removes disabled button and renables the button
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });
});
