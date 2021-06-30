/*
  Clean Architecture Controller for the DELETE Webhook REST API.
  This controller is called to delete an existing webhook.
*/

let _this

class DeleteWebhook {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating DeleteWebhook REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating DeleteWebhook REST Controller.'
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
   * @api {delete} /webhook Delete
   * @apiPermission public
   * @apiName Webhook Delete
   * @apiGroup Webhook
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE -d '{ "url": "https://test.com/my-webhook", "appId": "test" }' localhost:5001/webhook/
   *
   * @apiDescription
   * Delete and existing webhook.
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

      // Returns true or false depending on the state of success.
      const success = await this.useCases.webhook.remove(inputData)

      ctx.body = {
        success
      }
    } catch (err) {
      console.log('Error in delete-webhook.js/restController()')
      throw err
    }
  }
}

module.exports = DeleteWebhook
