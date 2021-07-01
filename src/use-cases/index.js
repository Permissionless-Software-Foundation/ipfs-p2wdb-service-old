// Individual Use Case libraries
const EntryUseCases = require('./entry')
const WebhookUseCases = require('./webhook')

// const adapters = require('../adapters')

class UseCases {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Use Cases library.'
      )
    }

    // Instantiate the use-case libraries.
    this.entry = new EntryUseCases(localConfig)
    this.webhook = new WebhookUseCases(localConfig)
  }
}

module.exports = UseCases
