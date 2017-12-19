var tactileActuary = require('./actuary.js')

var update = function(path, data) {
  tactileActuary.updateNode(path, data);
}

module.exports = { update: update };
