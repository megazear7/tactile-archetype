var tactileActuary = require('./actuary.js')

var update = function(path, data, callback) {
  tactileActuary.updateNode(path, data, callback);
}

var add = function(path, data, callback) {
  tactileActuary.addNode(path, data, callback);
}

module.exports = { update: update, add: add };
