const tactileClerk = require('./tactile/clerk')
const componentModels = require('./components/components.js')
const authorModels = require('./components/author.js')
const PORT = process.env.PORT || 3000

tactileClerk.run(PORT, componentModels, authorModels);
