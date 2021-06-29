/*
  Prototype for triggering a webhook when new data is validated and written to
  the P2WDB.
*/

const validationEvent = require('../orbit/validation-event')
const WebhookModel = require('../../models/webhook')

let _this

class Webhook {
  constructor (localConfig) {
    // Attach the event handler to the event.
    validationEvent.on(
      'ValidationSucceeded',
      this.validationSucceededEventHandler
    )

    // Encapsulate dependencies
    this.WebhookModel = WebhookModel

    _this = this
  }

  // Event handler for the validation-succeeded event.
  // This handler will scan the event data for an 'appId'. If a webhook matching
  // that appId is found, it will trigger a call to the webhooks URL.
  async validationSucceededEventHandler (eventData) {
    try {
      console.log(
        'ValidationSucceeded event triggered from withing the webhook.js file. Data: ',
        eventData
      )

      // const { txid, signature, message, data, hash } = eventData
      const { data } = eventData

      // Attempt to parse the raw data as JSON
      let jsonData = {}
      try {
        jsonData = JSON.parse(data)
      } catch (err) {
        // Exit quietly. Entry does not comply with webhook protocol.
        return
      }

      const appId = jsonData.appId

      // Exit quietly if there is no appId in the JSON data.
      if (!appId) return

      const matches = this.WebhookModel.find({ appId })
      if (matches.length > 0) {
        await _this.triggerWebhook(matches)
      }
    } catch (err) {
      console.error('Error in validationSucceededEventHandler(): ', err)
      // Do not throw error. This is a top-level function.
    }
  }

  // This function expects an array of Webhook MongoDB model instances as input.
  // It loops through each match and executes that webhook.
  async triggerWebhook (matches) {
    console.log('triggerWebhook() triggered with these matches: ', matches)
  }
}

module.exports = Webhook
