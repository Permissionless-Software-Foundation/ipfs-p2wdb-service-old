/*
  Webhook Entity
*/

class Webhook {
  makeWebhook ({ url } = {}) {
    // Input validation.
    if (!url || typeof url !== 'string') {
      throw new Error('url for webhook must be a string.')
    }

    const webhook = { url }

    return webhook
  }
}

module.exports = Webhook
