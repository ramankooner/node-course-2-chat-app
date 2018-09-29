var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  // last list item
  // selector specific to children to message
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  // previous child (second to last item)
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  };

};

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      // redirects the user back to the join page
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });

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

socket.on('updateUserList', function (users) {
  // ordered list
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
  //console.log('Users list', users);
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
  scrollToBottom();

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
    scrollToBottom();
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
