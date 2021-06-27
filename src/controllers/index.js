/*
  This index file for the Clean Architecture Controllers loads dependencies,
  creates instances, and attaches the controller to REST API endpoints for
  Koa.
*/

// Public npm libraries.
const Router = require('koa-router')

// Load the Clean Architecture Use Case libraries.
const useCases = require('../use-cases')

// Load the REST API Controllers.
const PostEntry = require('./post-entry')
const GetAll = require('./get-all')

module.exports = function attachRESTControllers (app) {
  const baseUrl = '/temp'
  const router = new Router({ prefix: baseUrl })

  // curl -H "Content-Type: application/json" -X GET localhost:5001/temp/
  router.get('/', (ctx, next) => {
    const now = new Date()
    ctx.body = now.toLocaleString()
  })

  // Instantiate the POST entry controller.
  const postEntry = new PostEntry({
    addEntry: useCases.addEntry
  })

  // curl -H "Content-Type: application/json" -X POST -d '{ "user": "test" }' localhost:5001/temp/write
  router.post('/write', async (ctx, next) => {
    try {
      await postEntry.restController(ctx)
    } catch (err) {
      // console.error('Error in POST /temp/write controller')
      ctx.throw(422, err.message)
    }
  })

  const readAll = new GetAll({
    getEntries: useCases.readEntry
  })
  router.get('/all', async (ctx, next) => {
    try {
      await readAll.restController(ctx)
    } catch (err) {
      ctx.throw(422, err.message)
    }
  })

  // Attach the Controller routes to the Koa app.
  app.use(router.routes()).use(router.allowedMethods())
}
