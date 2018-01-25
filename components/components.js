var fs = require('fs');
const { join } = require('path')

function init(dust) {
  const isDirectory = source => fs.lstatSync(source).isDirectory()
  const directories = source =>
    fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

  var models = { };
  var authorModels = { };

  directories("components").forEach(function(directory) {
    var name = directory.split("/").slice(-1)[0];
    var filePath = directory + "/" + name + ".js";
    var modulePath = "./" + name + "/" + name + ".js";

    if (fs.existsSync(filePath)) {
      models[name] = require(modulePath);
    }

    var authorFilePath = directory + "/author.js";
    var authorModulePath = "./" + name + "/author.js";

    if (fs.existsSync(authorFilePath)) {
      authorModels[name] = require(authorModulePath);
    }

    var template = directory + "/" + name + ".html";
    var compiled = dust.compile(fs.readFileSync(template, 'utf8'), 'component-'+name);
    dust.loadSource(compiled);
  });

  return {
    models: models,
    authorModels: authorModels
  }
}

module.exports = init
