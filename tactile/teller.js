const officer = require("./officer.js")

var update = function(path, data) {
  officer.findNode(path)
  .then(node => setProperties(node._id, data))
}

var add = function(path, data, callback) {
  // TODO parse the path and separate out the last segment
  var existingPath = ""
  var newPathSegment = ""
  if (data.tacType == "page") {
    officer.findNode(existingPath)
    .then(node => addPage(node._id, data, newPathSegment))
  } else if (data.tacType == "comp") {
    officer.findNode(existingPath)
    .then(node => addComponent(node._id, data, newPathSegment))
  }
}

var remove = function(path, callback) {
  officer.findNode(path)
  .then(node => return {} /* TODO */)
}

module.exports = {
  update: update,
  add: add,
  remove: remove
};
