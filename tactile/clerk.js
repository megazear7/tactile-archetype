const express = require('express')
var bodyParser = require('body-parser');
const tactileBroker = require('./broker')
const tactileTeller = require('./teller')

var run = function(port, componentModels, authorModels) {
  const app = express();

  app.use(bodyParser.json({type: "*/json"}));
  app.use(express.static('dist'));

  app.get('/*.json', function (req, res) {
      console.log("Request [GET JSON]: " + req.path);
      var path = req.path.slice(1).split(".")[0];
      var isAuthor = req.query.mode === "author";
      res.send(tactileBroker.model(path, componentModels, authorModels, isAuthor));
  });

  app.get('/*', function (req, res) {
      console.log("Request [GET]: " + req.path);
      var path = req.path.slice(1);
      var isAuthor = req.query.mode === "author";
      res.send(tactileBroker.render(path, componentModels, authorModels, isAuthor));
  });

  app.post('/*', function (req, res) {
      console.log("Request [POST]: " + req.path);
      var path = req.path.slice(1);
      var isAuthor = req.query.mode === "author";
      tactileTeller.update(path, req.body, function() {
        res.send(tactileBroker.model(path, componentModels, authorModels, isAuthor));
      });
  });

  app.listen(port, () => console.log('Tactile app listening on port ' + port));
}

module.exports = { run: run };
