/*
  This index file for the Clean Architecture Controllers loads dependencies,
  creates instances, and attaches the controller to REST API endpoints for
  Koa.
*/

// Public npm libraries.
const Router = require('koa-router')

// Load the REST API Controllers.
const PostEntry = require('./rest/post-entry')
const GetAll = require('./rest/get-all')

// Load the Clean Architecture Adapters library
const adapters = require('../adapters')

// Load the JSON RPC Controller.
const JSONRPC = require('./json-rpc')
// const rpc = new JSONRPC()

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

// Add the JSON RPC router to the ipfs-coord adapter.
function attachRPCControllers () {
  // const jsonRpcController = new JSONRPC()
  // jsonRpcController.ipfsCoord =
  //   adapters.p2wdb.ipfsAdapters.ipfsCoordAdapter.ipfsCoord

  // Get the instance of ipfs-coord being used by the Adapter library.
  const ipfsCoord = adapters.p2wdb.ipfsAdapters.ipfsCoordAdapter.ipfsCoord

  const jsonRpcController = new JSONRPC({ ipfsCoord })

  // Attach the input of the JSON RPC router to the output of ipfs-coord.
  adapters.p2wdb.ipfsAdapters.ipfsCoordAdapter.attachRPCRouter(
    jsonRpcController.router
  )
}

function attachRESTControllers (app) {
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
