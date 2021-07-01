/*
  Clean Architecture Controller for the POST Webhook.
  This controller is called to create a new webhook.
*/

// const useCases = require('../../use-cases')

let _this

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

    _this = this
  }

  async routeHandler (ctx, next) {
    try {
      await _this.restController(ctx)
    } catch (err) {
      // console.error('Error in POST /temp/write controller')
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {post} /webhook New
   * @apiPermission public
   * @apiName Webhook New
   * @apiGroup Webhook
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "url": "https://test.com/my-webhook", "appId": "test" }' localhost:5001/webhook/
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
      // console.log(`inputData: ${JSON.stringify(inputData, null, 2)}`)

      // Returns the MongoDB ID of the new entry.
      const id = await this.useCases.webhook.addWebhook.addNewWebhook(inputData)

      ctx.body = {
        success: true,
        id
      }
    } catch (err) {
      console.log('Error in post-webhook.js/restController()')
      throw err
    }
  }
}

module.exports = PostWebhook
