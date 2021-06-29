/*
  Koa router and controller for REST API endpoints concerned with the Entry
  entity.
*/

// Public npm libraries.
const Router = require('koa-router')

// Load the REST API Controllers.
const PostEntry = require('./post-entry')
const GetAll = require('./get-all')

class EntryController {
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

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Instantiate the REST API controllers
    this.postEntry = new PostEntry(dependencies)
    this.readAllEntries = new GetAll(dependencies)

    // Instantiate the router.
    const baseUrl = '/p2wdb'
    this.router = new Router({ prefix: baseUrl })
  }

  attachEntityControllers (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attached REST API controllers.'
      )
    }

    // curl -H "Content-Type: application/json" -X POST -d '{ "user": "test" }' localhost:5001/p2wdb/write
    this.router.post('/write', async (ctx, next) => {
      try {
        await this.postEntry.restController(ctx)
      } catch (err) {
        // console.error('Error in POST /temp/write controller')
        ctx.throw(422, err.message)
      }
    })

    // curl -H "Content-Type: application/json" -X GET localhost:5001/p2wdb/all
    this.router.get('/all', async (ctx, next) => {
      try {
        await this.readAllEntries.restController(ctx)
      } catch (err) {
        ctx.throw(422, err.message)
      }
    })

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes()).use(this.router.allowedMethods())
  }
}

module.exports = EntryController
