var moment = require('moment');

// current point in time
//var date = moment();
//date.add(11, 'year').subtract(9,'months');
//console.log(date.format('MMM Do, YYYY'));

var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);
var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));
