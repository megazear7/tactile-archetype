const express = require('express')
const tactileBroker = require('./broker')

var run = function(port, componentModels, authorModels) {
  const app = express();

  app.use(express.static('dist'));

  app.get('/*', function (req, res) {
      console.log("Request: " + req.path);
      var pathParts = req.path.slice(1);
      var isAuthor = req.query.mode === "author";
      res.send(tactileBroker.render(pathParts, componentModels, authorModels, isAuthor));
  });

  app.listen(port, () => console.log('Tactile app listening on port ' + port));
}

module.exports = { run: run };
