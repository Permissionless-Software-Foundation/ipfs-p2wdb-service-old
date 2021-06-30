// Individual Use Case libraries
const AddEntry = require('./add-entry')
const ReadEntry = require('./read-entry')
const AddWebhook = require('./add-webhook')

// const adapters = require('../adapters')

class UseCases {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Use Cases library.'
      )
    }

    // Instantiate the use cases.
    this.addEntry = new AddEntry({
      p2wdbAdapter: this.adapters.p2wdb,
      entryAdapter: this.adapters.entry
    })

    this.readEntry = new ReadEntry({ p2wdbAdapter: this.adapters.p2wdb })

    this.addWebhook = new AddWebhook({ webhookAdapter: this.adapters.webhook })
  }
}

// Instantiate the Use Cases
// const addEntry = new AddEntry({
//   p2wdb: adapters.p2wdb,
//   localdb: adapters.localdb
// })
// const readEntry = new ReadEntry({ p2wdb: adapters.p2wdb })

// Export the instances of the use-cases.
// module.exports = {
//   addEntry,
//   readEntry
// }

module.exports = UseCases
