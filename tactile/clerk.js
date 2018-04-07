const express = require('express');
const bodyParser = require('body-parser');
const tactileBroker = require('./broker');
const tactileOfficer = require('./officer');
const tactileTeller = require('./teller');

var run = function(port) {
  const app = express();

  app.use(bodyParser.json({type: "*/json"}));
  app.use(express.static('dist'));

  /* Example:
  GET /some/path
  */
  app.get('/*', function (req, res) {
      console.log("Request [GET]: " + req.path);
      var path = req.path.slice(1);
      tactileBroker.render(path, function(responseBody) {
        res.send(responseBody);
      });
  });

  /* Example:
  GET /some/path.json
  */
  app.get('/*.json', function (req, res) {
      console.log("Request [GET JSON]: " + req.path);
      var path = req.path.slice(1).split(".")[0];
      tactileBroker.model(path, function(responseBody) {
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
    tactileTeller.update(req.path, req.body)
    .then(responseData => res.send(responseData))
    .catch(e => {
      console.error(e);
      res.status(400);
      res.send({message: e.message});
    })
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
    tactileTeller.add(req.path, req.body)
    .then(responseData => res.send(responseData))
    .catch(e => res.status(400).send({message: e.message}))
  });

  /* Example:
  DELETE /some/path
  */
  app.delete('/*', function (req, res) {
    console.log("Request [DELETE]: " + req.path);
    tactileTeller.remove(req.path)
    .then(parent => res.send(parent))
    .catch(e => {
      console.error(e);
      res.status(400);
      res.send({message: e.message});
    })
  });

  app.listen(port);
}

module.exports = { run: run };
