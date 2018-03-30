var update = function(path, data, callback) {
  return officer.sendQuery(`
    MATCH (parent:page)-[:has_child]->(current:page)
    RETURN parent`)
  .then(node => console.log(node))
  .catch(e => console.error(e))
}

var add = function(path, data, callback) {
  // TODO Reimplement using the officer
}

var remove = function(path, callback) {
  // TODO Reimplement using the officer
}

module.exports = {
  update: update,
  add: add,
  remove: remove
};
