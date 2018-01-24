var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env['NEO4J_URL']);

function sendQuery(query, success, error, resultIdentifier) {
  db.cypher({
      query: query
  }, function (err, results) {
      if (err) {
        if (typeof error != 'undefined') {
          error(err);
        }
      } else {
        if (typeof success != 'undefined') {
          if (typeof resultIdentifier != 'undefined') {
            success(results[0][resultIdentifier])
          } else {
            success(results)
          }
        }
      }
  });
}

/* Turns an object into a neo4j compatible property list of properties to set.
 * properties: Flat object with a list of properties to set.
 */
function generatePropertyList(properties) {
  var propList = []

  Object.keys(properties).forEach(function(key) {
    propList.push(key + ':"' + properties[key] + '"');
  });

  return '{' + propList.join(',') + '}'
}

/* Turns an object into a neo4j compatible list of properties to set.
 * identifier: The neo4j identifier to set the properties on.
 * properties: Flat object with a list of properties to set.
 */
function generateSetList(identifier, properties) {
  var setList = []

  Object.keys(properties).forEach(function(key) {
    setList += identifier + '.' + key + '=\"' + properties[key] + '\"';
  });

  return setList.join(',')
}

/* Turns an rray into a neo4j compatible list of properties to remove.
 * identifier: The neo4j identifier to set the properties on.
 * properties: Array of properties to remove.
 */
function generateRemoveList(identifier, properties) {
  var removeList = []

  Object.keys(properties).forEach(function(key) {
    removeList += identifier + '.' + key;
  });

  return removeList.join(',')
}

/* nodeId: The id of the node that the new component will be added under
 * component: Flat object with the component's properties.
 * path: The path attribute of the relationship. This attribute helps define the url
 *       that leads to this component.
 * success: success callback, an array of results will be returned
 * error: error callback, an error object is returned.
 */
function addComponent(nodeId, component, path, success, error) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  CREATE (n)-[r:has_component {path: "${path}"}]->(c:component ${generatePropertyList(component)})
  RETURN n,c
  `

  sendQuery(query, success, error, "c");
}

/* parentId: The id of the parent page that the new page will be added under.
 * page: Flat object with the page's properties.
 * path: The path attribute of the relationship. This attribute helps define the url
 *       that leads to this component.
 * success: success callback, an array of results will be returned
 * error: error callback, an error object is returned.
 */
function addPage(parentId, page, path, success, error) {
  var query =
  `
  MATCH (p1)
  WHERE ID(p1)=${parentId}
  CREATE (p1)-[r:has_child {path: "${path}"}]->(p2:page ${generatePropertyList(page)})
  RETURN p1,r,p2
  `

  sendQuery(query, success, error, "p2");
}

/* node: nodeId
 * properties: Flat object with a list of properties to set.
 * success: success callback, an array of results will be returned
 * error: error callback, an error object is returned.
 */
function setProperties(nodeId, properties, success, error) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  SET ${generateSetList(properties)}
  RETURN n
  `

  sendQuery(query, success, error);
}

/* node: nodeId
 * properties: String array of properties to remove or a string with a single
               property to remove.
 * success: success callback, an array of results will be returned
 * error: error callback, an error object is returned.
 */
function removeProperties(nodeId, properties, success, error) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  REMOVE ${generateRemoveList(properties)}
  RETURN n
  `

  sendQuery(query, success, error);
}

module.exports = {
  sendQuery: sendQuery,
  addComponent: addComponent,
  addPage: addPage,
  setProperties: setProperties,
  removeProperties: removeProperties
};
