const express = require('express');
var bodyParser = require('body-parser');
const tactileBroker = require('./broker');
const tactileOfficer = require('./officer');
const tactileTeller = require('./teller');
var fs = require('fs');

var run = function(port, componentModels, authorModels) {
  const app = express();

  app.use(bodyParser.json({type: "*/json"}));
  app.use(express.static('dist'));

  // This should be an ENV config
  var isAuthor = true;

  app.get('/*.json', function (req, res) {
      console.log("Request [GET JSON]: " + req.path);
      var path = req.path.slice(1).split(".")[0];
      res.send(tactileBroker.model(path, componentModels, authorModels, isAuthor));
  });

  app.get('/*', function (req, res) {
      console.log("Request [GET]: " + req.path);
      var path = req.path.slice(1);
      res.send(tactileBroker.render(path, componentModels, authorModels, isAuthor));
  });

  app.post('/*', function (req, res) {
      console.log("Request [POST]: " + req.path);
      var path = req.path.slice(1);
      tactileTeller.update(path, req.body, function() {
        res.send(tactileBroker.model(path, componentModels, authorModels, isAuthor));
      });
  });

  app.put('/*', function (req, res) {
      console.log("Request [PUT]: " + req.path);
      var path = req.path.slice(1);
      tactileTeller.add(path, req.body, function() {
        res.send(tactileBroker.model(path, componentModels, authorModels, isAuthor));
      });
  });

  app.delete('/*', function (req, res) {
      console.log("Request [DELETE]: " + req.path);
      var path = req.path.slice(1);
      tactileTeller.remove(path, function(parent) {
        res.send(parent);
      });
  });

  app.listen(port);

  // I was using this for testing HTTP2
  // Remember to access through https, not http, or setup server to forward http to https.
  // Currently I have a ssl enabled reverse proxy using apache at https://tacile.localhost
  /*var options = {
    key: fs.readFileSync('./tactile/tls/server.key'),
    cert: fs.readFileSync('./tactile/tls/server.crt'),
    spdy: {
      protocols: [ 'h2' ]
    }
  };
  require('spdy').createServer(options, app).listen(port, () => {
    console.log('Tactile app listening on port ' + port)
  });*/
}

module.exports = { run: run };
