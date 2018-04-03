const officer = require("./officer.js")

var update = function(path, data) {
  officer.findNode(path)
  .then(node => setProperties(node._id, data))
}

var add = function(path, data, callback) {
  const lastOccurance = path.lastIndexOf("/")
  var existingPath = path.substring(0, lastOccurance)
  var newPathSegment = path.substring(lastOccurance + 1)
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
  .then(node => {
    officer.removeNode(node._id)
  })
}

module.exports = {
  update: update,
  add: add,
  remove: remove
};
