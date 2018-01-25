var fs = require('fs');
const { join } = require('path')

function init(dust) {
  const isDirectory = source => fs.lstatSync(source).isDirectory()
  const directories = source =>
    fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

  directories("pages").forEach(function(directory) {
    var name = directory.split("/").slice(-1)[0];
    var template = directory + "/" + name + ".html";
    var compiled = dust.compile(fs.readFileSync(template, 'utf8'), 'page-'+name);
    dust.loadSource(compiled);
  });

  return {
  }
}

module.exports = init
