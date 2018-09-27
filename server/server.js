const path = require('path');
const express = require('express');

// this goes straight to the public folder without having to go through the server folder
const publicPath = path.join(__dirname, '../public');
const port = proccess.env.PORT || 3000;
// old way of getting public folder
// console.log(__dirname + '/../public');
//
// console.log(publicPath);


var app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
