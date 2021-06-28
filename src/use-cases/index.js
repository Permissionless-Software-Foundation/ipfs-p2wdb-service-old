// Individual Use Case libraries
const AddEntry = require('./add-entry')
const ReadEntry = require('./read-entry')

const adapters = require('../adapters')

// Instantiate the Use Cases
const addEntry = new AddEntry({
  p2wdb: adapters.p2wdb,
  localdb: adapters.localdb
})
const readEntry = new ReadEntry({ p2wdb: adapters.p2wdb })

// Export the instances of the use-cases.
module.exports = {
  addEntry,
  readEntry
}
