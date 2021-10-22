var neo4j = require('neo4j-driver')
var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'test')
)

async function sendQuery(query, resultIdentifier) {

  var session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE
  });

  return session.run(query)
  .then(result => {
    //console.log('Query', query, result.records);
    if (result.records && result.records.length > 0 && resultIdentifier) {
      return result.records[0].get(resultIdentifier);
    } else {
      return result;
    }
  })
  .catch(e => console.error(e));
}

async function close() {
  return driver.close();
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
  const pathExists = paths.records.length > 0

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

/* nodeId: The id of the node that the new component will be added under
 * component: Flat object with the component's properties.
 * path: The path attribute of the relationship. This attribute helps define the url
 *       that leads to this component.
 */
async function addNode(nodeId, data, path) {
  const pathQuery = `
  MATCH (n)-[r:has_child {path: "${path}"}]->(c:generic)
  WHERE ID(n)=${nodeId}
  RETURN c
  `

  const paths = await sendQuery(pathQuery)
  const pathExists = paths.length > 0

  if (! pathExists) {
    var query =
    `
    MATCH (n1)
    WHERE ID(n1)=${nodeId}
    CREATE (n1)-[r:has_child {path: "${path}"}]->(n2:generic ${generatePropertyList(data)})
    RETURN n2
    `

    return sendQuery(query, "n2");
  } else {
    return new Promise((resolve, reject) => reject(new Error("Path already exists")))
  }
}

/*
 * Finds the next index by counting the number of nodes under the specified node
 * and then adding 1.
 */
async function findNextIndex(path) {
  const query =
  `
  MATCH ()-${generatePathList(path, "has_child")}->()-[r:has_child]->()
  RETURN r
  `

  const result = await sendQuery(query);

  return result.length + 1
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
  if (Object.keys(properties).length > 0) {
    const query =
    `
    MATCH (n)
    WHERE ID(n)=${nodeId}
    SET ${generateSetList("n", properties)}
    RETURN n
    `

    return sendQuery(query, "n")
  } else {
    const query =
    `
    MATCH (n)
    WHERE ID(n)=${nodeId}
    RETURN n
    `

    return sendQuery(query, "n")
  }
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

/* path: The absolute path to a node
 */
function hasNode(path) {
  if (path === "/" || path === "") {
    return true
  } else {
    var query =
    `
    MATCH (r:rootpage)-${generatePathList(path, "has_child")}->(n)
    RETURN n
    `

    const node = sendQuery(query)

    return node.length() > 0;
  }
}

/* path: The absolute path to check
 */
function nodeExists(path) {
  if (path === "/" || path === "") {
    return Promise.resolve(true)
  } else {
    var query =
    `
    MATCH (r:rootpage)-${generatePathList(path, "has_child")}->(n)
    RETURN n
    `

    return sendQuery(query).then(result => result.length > 0);
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

  return sendQuery(query, "n");
}

module.exports = {
  sendQuery: sendQuery,
  close: close,
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
  hasNode: hasNode,
  addNode: addNode,
  findNextIndex: findNextIndex,
  removeNode: removeNode,
  nodeExists: nodeExists
};
