var fs = require('fs');
//var Handlebars = require('handlebars')
const dust = require('dustjs-linkedin')
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
    var compiled = dust.compile(fs.readFileSync(template, 'utf8'), 'component-'+name);
    dust.loadSource(compiled);
  });

  // TODO in Prod we should not reload the components on every request
  directories("pages").forEach(function(directory) {
    var name = directory.split("/").slice(-1)[0];
    var template = directory + "/" + name + ".html";
    var compiled = dust.compile(fs.readFileSync(template, 'utf8'), 'page-'+name);
    dust.loadSource(compiled);
  });

  officer.findPage(path, function(page) {

    dust.helpers.render = function(chunk, context, bodies, params) {
      test = new Promise(function(resolve, reject) {
        dust.render('component-'+'header', {}, function(err, out) {
          if (err) {
            throw err
          } else {
            chunk.write(out)
          }
        });
      })
    }

    page.test = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve("Hello, World!")
      }, 1000)
    })

    dust.render('page-'+page.properties.pageType, page, function(err, out) {
      if (err) {
        throw err
      } else {
        callback(out)
      }
    });

  })
}

module.exports = { render: render, model: model }
