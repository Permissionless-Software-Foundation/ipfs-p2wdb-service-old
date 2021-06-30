/*
  Koa router and controller for REST API endpoints concerned with the Webhook
  entity.
*/

// Public npm libraries.
const Router = require('koa-router')

// Load the REST API Controllers.
const PostWebhook = require('./post-webhook')

class WebhookRESTController {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Webhook REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Webhook REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Instantiate the REST API controllers
    this.postWebhook = new PostWebhook(dependencies)

    // Instantiate the router.
    const baseUrl = '/webhook'
    this.router = new Router({ prefix: baseUrl })
  }

  attachControllers (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attached REST API controllers.'
      )
    }

    // curl -H "Content-Type: application/json" -X POST -d '{ "user": "test" }' localhost:5001/p2wdb/write
    this.router.post('/', async (ctx, next) => {
      try {
        await this.postWebhook.restController(ctx)
      } catch (err) {
        // console.error('Error in POST /temp/write controller')
        ctx.throw(422, err.message)
      }
    })

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

module.exports = WebhookRESTController
