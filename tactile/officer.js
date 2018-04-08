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
            if (typeof results[0] != 'undefined' && typeof results[0][resultIdentifier] != 'undefined') {
              resolve(results[0][resultIdentifier])
            } else {
              reject({})
            }
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
function generatePathList(path, relationship) {
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

  return pathList.join('->()-')
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
    if (typeof properties[key] === "string") {
      setList.push(identifier + '.' + key + '=\"' + properties[key] + '\"');
    } else if (typeof properties[key] === "boolean") {
      setList.push(identifier + '.' + key + '=' + properties[key]);
    }
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
 */
async function addComponent(nodeId, component, path) {
  const pathQuery = `
  MATCH (n)-[r:has_child {path: "${path}"}]->(c:component)
  WHERE ID(n)=${nodeId}
  RETURN c
  `

  const paths = await sendQuery(pathQuery)
  const pathExists = paths.length > 0

  if (! pathExists) {
    var query =
    `
    MATCH (n)
    WHERE ID(n)=${nodeId}
    CREATE (n)-[r:has_child {path: "${path}"}]->(c:component ${generatePropertyList(component)})
    RETURN n,c
    `

    return sendQuery(query, "c");
  } else {
    return new Promise((resolve, reject) => reject(new Error("Path already exists")))
  }
}

/* parentId: The id of the parent page that the new page will be added under.
 * page: Flat object with the page's properties.
 * path: The path attribute of the relationship. This attribute helps define the url
 *       that leads to this component.
 */
async function addPage(parentId, page, path) {
  const pathQuery = `
  MATCH (p1)-[r:has_child {path: "${path}"}]->(p2:page)
  WHERE ID(p1)=${parentId}
  RETURN p2
  `
  const paths = await sendQuery(pathQuery)
  const pathExists = paths.length > 0

  if (! pathExists) {
    var addQuery =
    `
    MATCH (p1)
    WHERE ID(p1)=${parentId}
    CREATE (p1)-[r:has_child {path: "${path}"}]->(p2:page ${generatePropertyList(page)})
    RETURN p1,r,p2
    `

    return sendQuery(addQuery, "p2");
  } else {
    return new Promise((resolve, reject) => reject(new Error("Path already exists")))
  }
}

/* node: nodeId
 * properties: Flat object with a list of properties to set.
 */
function setProperties(nodeId, properties) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  SET ${generateSetList("n", properties)}
  RETURN n
  `

  console.log(query);

  return sendQuery(query, "n");
}

/* node: nodeId
 * properties: String array of properties to remove or a string with a single
               property to remove.
 */
function removeProperties(nodeId, properties) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  REMOVE ${generateRemoveList(properties)}
  RETURN n
  `

  return sendQuery(query, "n");
}

/* pageId: The page id to search under
 * path: The relative path to a page
 */
function findRelativePage(pageId, path) {
  var query =
  `
  MATCH (p1)-${generatePathList(path, "has_child")}->(p2:page)
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
 */
function findPage(path) {
  if (path === "/" || path === "") {
    return rootPage()
  } else {
    var query =
    `
    MATCH (p1:rootpage)-${generatePathList(path, "has_child")}->(p2:page)
    RETURN p2
    `

    return sendQuery(query, "p2");
  }
}

/* nodeId: The id of the node to look under
 */
function getComponents(nodeId) {
  var query =
  `
  MATCH (n)-[:has_child]->(c:component)
  WHERE ID(n)=${nodeId}
  RETURN c
  `

  return sendQuery(query);
}

/* nodeId: The id of the node to look under
 * path: The path to the component
 */
function findComponent(nodeId, path) {
  var query =
  `
  MATCH (n)-${generatePathList(path, "has_child")}->(c:component)
  WHERE ID(n)=${nodeId}
  RETURN c
  `

  return sendQuery(query, "c");
}

/* nodeId: The id of the node to look under
 * path: The path to the component
 */
function findRelativeNode(nodeId, path) {
  var query =
  `
  MATCH (n1)-${generatePathList(path, "has_child")}->(n2)
  WHERE ID(n1)=${nodeId}
  RETURN n2
  `

  return sendQuery(query, "n2");
}

/* path: The absolute path to a node
 */
function findNode(path) {
  if (path === "/" || path === "") {
    return rootPage()
  } else {
    var query =
    `
    MATCH (r:rootpage)-${generatePathList(path, "has_child")}->(n)
    RETURN n
    `

    return sendQuery(query, "n");
  }
}

/* nodeId: The id of the node to be removed.
 */
function removeNode(nodeId) {
  var query =
  `
  MATCH (n)
  WHERE ID(n)=${nodeId}
  DETACH DELETE n
  RETURN n
  `

  console.log("A")
  console.log(query)

  return sendQuery(query, "n");
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
  findComponent: findComponent,
  findRelativeNode: findRelativeNode,
  findNode: findNode,
  removeNode: removeNode
};
