/*
  Clean Architecture Controller for the POST Webhook.
  This controller is called to create a new webhook.
*/

// const useCases = require('../../use-cases')

class PostWebhook {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating PostEntry REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating PostEntry REST Controller.'
      )
    }
  }

  /**
   * @api {post} /webhook New
   * @apiPermission public
   * @apiName Webhook New
   * @apiGroup Webhook
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "url": "https://test.com/my-webhook", "appId": "test" }' localhost:5001/temp/webhook
   *
   * @apiDescription
   * Add a new webhook. When a new database entry is added that matches the appID,
   * a webhook will call the given URL.
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async restController (ctx) {
    try {
      const url = ctx.request.body.url
      const appId = ctx.request.body.appId

      const inputData = { url, appId }
      console.log(`inputData: ${JSON.stringify(inputData, null, 2)}`)

      console.log('this.useCases: ', this.useCases)
      console.log('this.useCases.addWebhook: ', this.useCases.addWebhook)

      // const hash = await this.addEntry.addUserEntry(writeObj)
      const id = await this.useCases.addWebhook.addWebhook(inputData)

      ctx.body = {
        success: true,
        id
      }
    } catch (err) {
      console.log('Error in post-webhook.js/restController(): ', err)
      throw err
    }
  }
}

module.exports = PostWebhook
