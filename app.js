const tactileClerk = require('./tactile/clerk')
const componentModels = require('./components/components.js')
const authorModels = require('./components/author.js')

tactileClerk.run(3000, componentModels, authorModels);
