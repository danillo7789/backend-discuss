// controller.js
const path = require('path');

const data = require(path.join(__dirname, '../ping.json'));

exports.getPing = (req, res) => {
  res.json(data);
};