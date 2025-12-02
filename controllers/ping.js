// controller.js
// const path = require('path');

// const data = require(path.join(__dirname, '../ping.json'));

const data = {
  message: "This is a ping",
  day: new Date().toDateString()
}

exports.getPing = (req, res) => {
  res.json(data);
};