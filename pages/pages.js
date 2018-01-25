const fs = require('fs');
const { join } = require('path')

module.exports = function(dust) {
  const isDirectory = source => fs.lstatSync(source).isDirectory()
  const directories = source =>
    fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

  var models = { };
  var authorModels = { };
  
  directories("pages").forEach(function(directory) {
    var name = directory.split("/").slice(-1)[0];

    // Add model
    var filePath = directory + "/" + name + ".js";
    var modulePath = "./" + name + "/" + name + ".js";
    if (fs.existsSync(filePath)) {
      models[name] = require(modulePath);
    }

    // Add author model
    var authorFilePath = directory + "/author.js";
    var authorModulePath = "./" + name + "/author.js";
    if (fs.existsSync(authorFilePath)) {
      authorModels[name] = require(authorModulePath);
    }

    // Add template
    var template = directory + "/" + name + ".html";
    var compiled = dust.compile(fs.readFileSync(template, 'utf8'), 'page-'+name);
    dust.loadSource(compiled);
  });

  return {
    models: models,
    authorModels: authorModels
  }
}
