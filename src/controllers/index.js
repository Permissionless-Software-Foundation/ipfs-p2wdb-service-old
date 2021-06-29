/*
  This index file for the Clean Architecture Controllers loads dependencies,
  creates instances, and attaches the controller to REST API endpoints for
  Koa.
*/

// Public npm libraries.
const Router = require('koa-router')

// Load the REST API Controllers.
const EntryController = require('./rest/entry')
const PostWebhook = require('./rest/post-webhook')

// Load the Clean Architecture Adapters library
const adapters = require('../adapters')

// Load the JSON RPC Controller.
const JSONRPC = require('./json-rpc')

// Load the Clean Architecture Use Case libraries.
const UseCases = require('../use-cases')
const useCases = new UseCases({ adapters })

// Top-level function for this library.
// Start the various Controllers and attach them to the app.
async function attachControllers (app) {
  // Attach the REST controllers to the Koa app.
  attachRESTControllers(app)

  // Start the P2WDB.
  await adapters.p2wdb.start()

  // Start the P2WDB and attach the validation event handler/controller to
  // the add-entry Use Case.
  await attachValidationController()

  attachRPCControllers()
}

function attachRESTControllers (app) {
  // Attach the REST API Controllers associated with the Entry Entity to the Koa app.
  const entryController = new EntryController({
    adapters,
    useCases
  })
  entryController.attachEntityControllers(app)

  const baseUrl = '/temp'
  const router = new Router({ prefix: baseUrl })

  // curl -H "Content-Type: application/json" -X GET localhost:5001/temp/
  router.get('/', (ctx, next) => {
    const now = new Date()
    ctx.body = now.toLocaleString()
  })

  // Instantiate the POST Webhook controller.
  const postWebhook = new PostWebhook({
    adapters,
    useCases
  })
  // curl -H "Content-Type: application/json" -X POST -d '{ "user": "test" }' localhost:5001/temp/write
  router.post('/webhook', async (ctx, next) => {
    try {
      await postWebhook.restController(ctx)
    } catch (err) {
      // console.error('Error in POST /temp/write controller')
      ctx.throw(422, err.message)
    }
  })

  // Attach the Controller routes to the Koa app.
  app.use(router.routes()).use(router.allowedMethods())
}

// Add the JSON RPC router to the ipfs-coord adapter.
function attachRPCControllers () {
  const jsonRpcController = new JSONRPC({ adapters, useCases })

  // Attach the input of the JSON RPC router to the output of ipfs-coord.
  adapters.p2wdb.ipfsAdapters.ipfsCoordAdapter.attachRPCRouter(
    jsonRpcController.router
  )
}

// Start the P2WDB and its downstream depenencies (IPFS, ipfs-coord, OrbitDB).
// Also attach the post-validation, peer-replication event handler (controller)
// to the Add-Entry Use Case.
async function attachValidationController () {
  try {
    // Trigger the addPeerEntry() use-case after a replication-validation event.
    adapters.p2wdb.orbit.validationEvent.on(
      'ValidationSucceeded',
      async function (data) {
        try {
          console.log(
            'ValidationSucceeded event triggering addPeerEntry() with this data: ',
            data
          )

          await useCases.addEntry.addPeerEntry(data)
        } catch (err) {
          console.error(
            'Error trying to process peer data with addPeerEntry(): ',
            err
          )
          // Do not throw an error. This is a top-level function.
        }
      }
    )
  } catch (err) {
    console.error('Error in controllers/index.js/startP2wdb()')
    throw err
  }
}

module.exports = { attachControllers }
