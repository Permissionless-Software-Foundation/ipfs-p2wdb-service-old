/*
  This is the Class Library for the write-entry use-case. This is when a user
  of this service wants to write a new Entry to the database. This is a different
  use case than a replication event triggered by a new entry from a peer database.
*/

const WebhookEntity = require('../../entities/webhook')

let _this

class AddWebhook {
  constructor (localConfig = {}) {
    if (!localConfig.webhookAdapter) {
      throw new Error(
        'localdb instance must be included when instantiating AddEntry'
      )
    }
    this.webhookAdapter = localConfig.webhookAdapter

    // Encapsulate dependencies.
    this.webhookEntity = new WebhookEntity()

    _this = this
  }

  // Add a new webhook entry to the local database.
  async addWebhook (rawData) {
    try {
      // Generate a validated entry by passing the raw data through input validation.
      const webhookData = _this.webhookEntity.makeWebhook(rawData)

      // Throw an error if the entry already exists.
      // const exists = await _this.localdb.doesEntryExist(entry)
      // if (exists) {
      //   throw new Error('Entry already exists in the database.')
      // }

      // Add the webhook entry to the local database.
      const id = await this.webhookAdapter.addWebhook(webhookData)

      return id
    } catch (err) {
      console.error('Error in addEntry.add()')
      throw err
    }
  }
}

module.exports = AddWebhook
