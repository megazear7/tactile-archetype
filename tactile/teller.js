const officer = require("./officer.js")

var update = function(path, data, callback) {
  officer.findNode(path)
  .then(node => officer.setProperties(node._id, data))
  .then(node => callback(node))
  .catch(e => console.log(e))
}

var add = function(path, data, callback) {
  if (data.node.tacType == "page") {
    officer.findNode(path)
    .then(node => officer.addPage(node._id, data.node, data.path))
    .then(page => callback(page))
    .catch(e => console.log(e))
  } else if (data.node.tacType == "comp") {
    officer.findNode(path)
    .then(node => officer.addComponent(node._id, data.node, data.path))
    .then(component => callback(component))
    .catch(e => console.log(e))
  } else {
    callback({ message: "tacType must be either 'page' or 'comp'" })
  }
}

var remove = function(path, callback) {
  officer.findNode(path)
  .then(node => officer.removeNode(node._id))
  .then(node => callback(node))
  .catch(e => console.log(e))
}

module.exports = {
  update: update,
  add: add,
  remove: remove
};
