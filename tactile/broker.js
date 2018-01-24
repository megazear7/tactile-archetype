var fs = require('fs');
var Handlebars = require('handlebars')
const { join } = require('path')
var officer = require('./officer.js')

var model = function(path, componentModels, authorModels, callback) {
  callback({test: "Hello, World!"})
}

var render = function(path, componentModels, authorModels, callback) {
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

  officer.findPage(path, function(page) {
    /*Handlebars.registerHelper('render', function(path, compType) {
      officer.findComponent(page._id, path, function(component) {
        var componentModel = componentModels[component.properties.compType];

        if (typeof componentModel !== "undefined") {
          component.model = componentModel.init(component);
        }

        if (process.env['MODE'] === "author") {
          var authorModel = authorModels[subNode.compType];
          if (typeof authorModel !== "undefined") {
            component.author = authorModel.init(component);
          }
        }

        //resolve(Handlebars.SafeString(componentTemplates[component.properties.compType](component)))
        resolve(Handlebars.SafeString("<p>From Promise</p>"))
      })
    });*/

    Handlebars.registerHelper('render', function(path) {
      return new Handlebars.SafeString(`<p>Render ${path}</p>`);
    });

    callback(Handlebars.compile(pageTemplates[page.properties.pageType])(page))
  })
}

module.exports = { render: render, model: model }
