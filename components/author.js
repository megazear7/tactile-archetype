var fs = require('fs');
const { join } = require('path')

const isDirectory = source => fs.lstatSync(source).isDirectory()
const directories = source =>
  fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

var authorModels = { };

// TODO in Prod we should not reload the components on every request
directories("components").forEach(function(directory) {
    var name = directory.split("/").slice(-1)[0];
    var filePath = directory + "/author.js";
    var modulePath = "./" + name + "/author.js";

    if (fs.existsSync(filePath)) {
      var authorModel = require(modulePath);
      authorModels[name] = authorModel;
    }
});

module.exports = authorModels
