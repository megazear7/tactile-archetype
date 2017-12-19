var fs = require('fs');
const { join } = require('path')

if (! fs.existsSync("content.json")) {
    save(JSON.parse(fs.readFileSync('content.seed.json', 'utf8')));
}

function getRoot() {
    return JSON.parse(fs.readFileSync('content.json', 'utf8'));
}

function isSafe(key, node) {
  return ["children", "siblings", "home", "parent", "page"].indexOf(key) == -1 && typeof node[key] === "object";
}

function containingPage(node) {
    while(node != undefined && node.tacType != "page") {
        node = node.parent;
    }

    return node;
};

function addReferences(node) {
    return addReferencesRecursive(node, node);
}

function findSiblings(node, key) {
    var siblings = [ ];
    for (var siblingName in node) {
      if (isSafe(siblingName, node) && node[siblingName].tacType === "page" && siblingName != key) {
        siblings.push(node[siblingName]);
      }
    }
    return siblings;
}

function findChildren(node, key) {
    var children = [ ];
    for (var childrenName in node[key]) {
      if (isSafe(childrenName, node[key]) && node[key][childrenName].tacType === "page") {
        children.push(node[key][childrenName]);
      }
    }
    return children;
}

function addReferencesToNode(node, key, root) {
    node[key].parent = node;
    node[key].nodeName = key;

    if (node.path === "/") {
      node[key].path = "/" + key;
    } else {
      node[key].path = node.path + "/" + key;
    }

    if (node[key].tacType != "page") {
        node[key].page = containingPage(node[key]);
    } else {
        node[key].siblings = findSiblings(node, key);
        node[key].children = findChildren(node, key);
        node[key].home = root;
    }
}

function addReferencesRecursive(node, root) {
    for(var key in node) {
        if (isSafe(key, node)) {
            addReferencesToNode(node, key, root);
            addReferencesRecursive(node[key], root)
        }
    }

    return node;
};

function findPage(path, isAuthor) {
    var root = getRoot();
    root.isHome = true;
    root.nodeName = "";
    root.isAuthor = isAuthor;
    root.path = "/";
    root.home = root;
    root.children = [ ];

    for (var childrenName in root) {
      if (isSafe(childrenName, root) && root[childrenName].tacType === "page") {
        root.children.push(root[childrenName]);
      }
    }

    return findNode(path, addReferences(root));
}

function findNode(path, root) {
    if (typeof root === "undefined") {
      root = getRoot();
    }

    var pathParts = path.split("/");
    var node = root;
    if (path.length > 0) {
        pathParts.forEach(function (val) {
            node = node[val];
        });
    }
    return node;
}

function updateNode(path, updates, callback) {
    root = getRoot();
    node = findNode(path, root);

    for (var key in updates) {
      node[key] = updates[key];
    }

    save(root, callback);
}

function save(root, callback) {
    var json = JSON.stringify(root);
    fs.writeFile('content.json', json, 'utf8', () => {
      if (typeof callback === "function") {
        callback();
      }
    });
}

module.exports = { findPage: findPage, findNode: findNode, updateNode: updateNode };
