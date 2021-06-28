/*
  Prototype for triggering a webhook when new data is validated and written to
  the P2WDB.
*/

const validationEvent = require('../orbit/validation-event')

class Webhook {
  constructor (localConfig) {
    validationEvent.on('ValidationSucceeded', function (data) {
      console.log(
        'ValidationSucceeded event triggered from withing the webhook.js file. Data: ',
        data
      )
      console.log(
        'In the future, this data will be filtered and used to trigger a webhook.'
      )
    })
  }
}

module.exports = Webhook
