const express = require('express');
const bodyParser = require('body-parser');
const dust = require('dustjs-linkedin')
const broker = require('./broker');
const officer = require('./officer.js')
const teller = require('./teller');
const components = require('../components/components.js')(dust)
const actuary = require('./actuary.js')(dust)

var run = function(port) {
  const app = express();

  app.use(bodyParser.json({type: "*/json"}));
  app.use(express.static('dist'));

  /* Example:
  GET /tac/author/components/text.json
  */
  app.get('/tac/author/components/:component.json', function (req, res) {
    console.log("Request [GET JSON]: " + req.path);
    if (process.env.isAuthor) {
      res.send(components.authorModels[req.params.component]({}));
    } else {
      res.send({message: "The server could not handle the request."});
    }
  });

  /* Example:
  GET /some/path.json
  */
  app.get('/*.author.json', function (req, res) {
    console.log("Request [GET JSON]: " + req.path);
    var path = req.path.slice(1).split(".")[0];
    broker.model(path)
    .then(model => {
      if (process.env.isAuthor) {
        authorModel = components.authorModels[model.properties.compType]
        res.send(authorModel ? authorModel(model) : {})
      } else {
        throw new Error("Prohibited")
      }
    })
    .catch(e => {
      console.error(e);
      res.status(400);
      res.send({message: "The server could not handle the request."});
    })
  });

  /* Example:
  GET /some/path.json
  */
  app.get('/*.json', function (req, res) {
    console.log("Request [GET JSON]: " + req.path);
    var path = req.path.slice(1).split(".")[0];
    broker.model(path)
    .then(model => {
      // TODO: Extend component
      //componentModel = components.models[model.properties.compType]
      //actuary.extendComponent(model, page, path)
      //res.send(componentModel ? componentModel(model) : {})

      res.send(model)
    })
    .catch(e => {
      console.error(e);
      res.status(400);
      res.send({message: "The server could not handle the request."});
    })
  });

  /* Example:
  GET /some/path
  */
  app.get('/*', function (req, res) {
    console.log("Request [GET]: " + req.path);
    var path = req.path.slice(1)
    broker.render(path)
    .then(responseBody => res.send(responseBody))
    .catch(e => {
      console.error(e);
      res.status(500);
      res.send("<html><head></head><body><h1>The server could not handle the request.</h1></body></html>");
    })
  });

  /* Example:
  POST /some/path
  {
  	"text": "Hello, World Updated!"
  }
  */
  app.post('/*', function (req, res) {
    console.log("Request [POST]: " + req.path);
    teller.update(req.path, req.body)
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
  OR exclude the path and the "next index" will be used.
  {
  	"node": {
  		"tacType": "comp",
  		"compType": "text",
  		"text": "Hello, World!"
  	}
  }  */
  app.put('/*', function (req, res) {
    console.log("Request [PUT]: " + req.path);
    if (req.body.path) {
      teller.add(req.path, req.body)
      .then(responseData => res.send(responseData))
      .catch(e => {
        console.error(e);
        res.status(400);
        res.send({message: e.message});
      })
    } else {
      teller.append(req.path, req.body)
      .then(responseData => res.send(responseData))
      .catch(e => {
        console.error(e);
        res.status(400);
        res.send({message: e.message});
      })
    }
  });

  /* Example:
  DELETE /some/path
  */
  app.delete('/*', function (req, res) {
    console.log("Request [DELETE]: " + req.path);
    teller.remove(req.path)
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
