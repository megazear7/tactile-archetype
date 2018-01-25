var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env['NEO4J_URL']);

function sendQuery(query, resultIdentifier) {
  return new Promise(function(resolve, reject) {
    db.cypher({
        query: query
    }, function (err, results) {
        if (err) {
          reject(err);
        } else {
          if (typeof resultIdentifier != 'undefined') {
            resolve(results[0][resultIdentifier])
          } else {
            resolve(results)
          }
        }
    })
  })
}

/* Turns a path string into a neo4j compatible relationship list
 * path: The path string to convert.
 */
function generatePathList(path, relationship, nodeType) {
  var pathList = []
  var segments = path.split("/")

  if (segments[0].trim() === "") {
    segments.shift()
  }

  if (segments.length >= 1 && segments[segments.length-1].trim() === "") {
    segments.pop()
  }

  segments.forEach(function(segment) {
    pathList.push('[:'+relationship+' {path: "'+segment+'"}]');
  });

  return pathList.join('->(:'+nodeType+')-')
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
 * success: success callback, the created component will the first parameter
 * error: error callback, an error object is returned.
 */
function addComponent(nodeId, component, path) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  CREATE (n)-[r:has_component {path: "${path}"}]->(c:component ${generatePropertyList(component)})
  RETURN n,c
  `

  return sendQuery(query, "c");
}

/* parentId: The id of the parent page that the new page will be added under.
 * page: Flat object with the page's properties.
 * path: The path attribute of the relationship. This attribute helps define the url
 *       that leads to this component.
 * success: success callback, the created page will the first parameter
 * error: error callback, an error object is returned.
 */
function addPage(parentId, page, path) {
  var query =
  `
  MATCH (p1)
  WHERE ID(p1)=${parentId}
  CREATE (p1)-[r:has_child {path: "${path}"}]->(p2:page ${generatePropertyList(page)})
  RETURN p1,r,p2
  `

  return sendQuery(query, "p2");
}

/* node: nodeId
 * properties: Flat object with a list of properties to set.
 * success: success callback, an array of results will the first parameter
 * error: error callback, an error object is returned.
 */
function setProperties(nodeId, properties) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  SET ${generateSetList(properties)}
  RETURN n
  `

  return sendQuery(query);
}

/* node: nodeId
 * properties: String array of properties to remove or a string with a single
               property to remove.
 * success: success callback, an array of results will the first parameter
 * error: error callback, an error object is returned.
 */
function removeProperties(nodeId, properties) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  REMOVE ${generateRemoveList(properties)}
  RETURN n
  `

  return sendQuery(query);
}

/* pageId: The page id to search under
 * path: The relative path to a page
 * success: success callback, the found page will the first parameter
 * error: error callback, an error object is returned.
 */
function findRelativePage(pageId, path) {
  var query =
  `
  MATCH (p1)-${generatePathList(path, "has_child", "page")}->(p2:page)
  WHERE ID(p1)=${pageId}
  RETURN p2
  `

  return sendQuery(query, "p2");
}

function rootPage() {
  query =
  `
  MATCH (p:rootpage)
  RETURN p
  `

  return sendQuery(query, "p");
}

/* path: The absolute path to a page
 * success: success callback, the found page will the first parameter
 * error: error callback, an error object is returned.
 */
function findPage(path) {
  if (path === "/" || path === "") {
    return rootPage()
  } else {
    var query =
    `
    MATCH (p1:rootpage)-${generatePathList(path, "has_child", "page")}->(p2:page)
    RETURN p2
    `

    return sendQuery(query, "p2");
  }
}

/* nodeId: The id of the node to look under
 * success: success callback, the component list will be the first parameter
 * error: error callback, an error object is returned.
 */
function getComponents(nodeId) {
  var query =
  `
  MATCH (n)-[:has_component]->(c:component)
  WHERE ID(n)=${nodeId}
  RETURN c
  `

  return sendQuery(query);
}

/* nodeId: The id of the node to look under
 * path: The path to the component
 * success: success callback, the component list will be the first parameter
 * error: error callback, an error object is returned.
 */
function findComponent(nodeId, path) {
  var query =
  `
  MATCH (n)-${generatePathList(path, "has_component", "component")}->(c:component)
  WHERE ID(n)=${nodeId}
  RETURN c
  `

  return sendQuery(query, "c");
}

module.exports = {
  sendQuery: sendQuery,
  addComponent: addComponent,
  addPage: addPage,
  setProperties: setProperties,
  removeProperties: removeProperties,
  findPage: findPage,
  findRelativePage: findRelativePage,
  getComponents: getComponents,
  findComponent: findComponent
};
