const express = require('express');
const bodyParser = require('body-parser');
const tactileBroker = require('./broker');
const tactileOfficer = require('./officer');
const tactileTeller = require('./teller');

var run = function(port) {
  const app = express();

  app.use(bodyParser.json({type: "*/json"}));
  app.use(express.static('dist'));

  app.get('/*.json', function (req, res) {
      console.log("Request [GET JSON]: " + req.path);
      var path = req.path.slice(1).split(".")[0];
      tactileBroker.model(path, function(responseBody) {
        res.send(responseBody);
      });
  });

  app.get('/*', function (req, res) {
      console.log("Request [GET]: " + req.path);
      var path = req.path.slice(1);
      tactileBroker.render(path, function(responseBody) {
        res.send(responseBody);
      });
  });


  /* Example:
  POST /some/path
  {
  	"text": "Hello, World Updated!"
  }
  */
  app.post('/*', function (req, res) {
      console.log("Request [POST]: " + req.path);
      tactileTeller.update(req.path, req.body, function(responseData) {
        res.send(responseData);
      });
  });

  /* Example:
  PUT /some/path
  {
  	"path": "text2",
  	"node": {
  		"tacType": "comp",
  		"compType": "text",
  		"text": "Hello, World!"
  	}
  }
  */
  app.put('/*', function (req, res) {
      console.log("Request [PUT]: " + req.path);
      tactileTeller.add(req.path, req.body, function(responseData) {
        res.send(responseData);
      });
  });

  /* Example:
  DELETE /some/path
  */
  app.delete('/*', function (req, res) {
      console.log("Request [DELETE]: " + req.path);
      tactileTeller.remove(req.path, function(parent) {
        console.log(parent);
        res.send(parent);
      });
  });

  app.listen(port);
}

module.exports = { run: run };
