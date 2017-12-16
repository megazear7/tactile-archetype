const express = require('express')
const tactileBroker = require('./broker')

var run = function(port, componentModels) {
  const app = express();

  app.use(express.static('dist'));

  app.get('/*', function (req, res) {
      console.log("Request: " + req.path);
      res.send(tactileBroker.render(req.path.slice(1), componentModels));
  });

  app.listen(port, () => console.log('Tactile app listening on port ' + port));
}

module.exports = { run: run };
