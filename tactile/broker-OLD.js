var fs = require('fs');
var Handlebars = require('handlebars');
const { join } = require('path')
const tactileActuary = require('./actuary.js')

var model = function(path, componentModels, authorModels, isAuthor) {
    var node = tactileActuary.findNode(path);
    var authorModel = authorModels[node.compType];

    if (typeof authorModel !== "undefined") {
      // TODO don't do this if we're in publish production.
      node.author = authorModel.init(node);
    }

    return node;
};

var render = function(path, componentModels, authorModels, isAuthor) {
    var page = tactileActuary.findPage(path, isAuthor);

    if (typeof page === "undefined") {
      // TODO Return the correct 404 HTTP response.
      throw new Error("Page Not Found");
    }

    var componentTemplates = {};
    var pageTemplates = {};

    const isDirectory = source => fs.lstatSync(source).isDirectory()
    const directories = source =>
      fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

    // TODO in Prod we should not reload the components on every request
    directories("components").forEach(function(directory) {
        var name = directory.split("/").slice(-1)[0];
        var template = directory + "/" + name + ".html";

        Handlebars.registerPartial(name, fs.readFileSync(template, 'utf8'));
        componentTemplates[name] = Handlebars.compile(fs.readFileSync(template, 'utf8'));
    });

    // TODO in Prod we should not reload the components on every request
    directories("pages").forEach(function(directory) {
        var name = directory.split("/").slice(-1)[0];
        var template = directory + "/" + name + ".html";
        pageTemplates[name] = fs.readFileSync(template, 'utf8');
    });

    /* If nodeName is false, then we assume that the current node is the actual
     * node. I.e there is no sub node.
     * If param2 is a string we assume this defines the compType. Otherwise we
     * assume that the compType equals the nodeName. */
    Handlebars.registerHelper('render', function(nodeName, param2) {
      // TODO if the first parameter is an object, use that as the subNode.

      var compType = nodeName;
      if (typeof param2 === "string") {
        compType = param2;
      }

      if (nodeName && typeof this[nodeName] === "undefined") {
        this[nodeName] = { compType: compType };
        addReferences(this);
      }

      var subNode;
      if (nodeName === false) {
        subNode = this;
      } else {
        subNode = this[nodeName];
      }

      var componentModel = componentModels[subNode.compType];

      if (typeof componentModel !== "undefined") {
        subNode.model = componentModel.init(subNode);
      }

      if (isAuthor) {
        var authorModel = authorModels[subNode.compType];

        if (typeof authorModel !== "undefined") {
          subNode.author = authorModel.init(subNode);
        }
      }

      return new Handlebars.SafeString(componentTemplates[subNode.compType](subNode));
    });

    return Handlebars.compile(pageTemplates[page.pageType])(page);;
};

module.exports = { render: render, model: model };
