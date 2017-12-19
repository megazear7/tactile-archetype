var tactileActuary = require('./actuary.js')

var update = function(path, data, callback) {
  console.log(path);
  console.log(data);
  tactileActuary.updateNode(path, data, callback);
}

var add = function(path, data, callback) {
  console.log(path);
  console.log(data);
  // TODO add a node of compType data.compType under the given path
}

module.exports = { update: update, add: add };
