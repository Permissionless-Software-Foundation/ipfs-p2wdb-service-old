/*
  Unit tests for the rpc/p2wdb/index.js file.

  TODO:
   - This file was forked from a13-users.unit.js. Tests for the P2WDB need to
   be added to it.
*/

// Public npm libraries
// const jsonrpc = require('jsonrpc-lite')
const mongoose = require('mongoose')
const sinon = require('sinon')
const assert = require('chai').assert
// const { v4: uid } = require('uuid')

// Set the environment variable to signal this is a test.
process.env.SVC_ENV = 'test'

// Local libraries
const config = require('../../../config')
const UserRPC = require('../../../src/rpc/users')
const RateLimit = require('../../../src/rpc/rate-limit')
// const UserModel = require('../../../src/models/users')

describe('#P2WDB-RPC', () => {
  let uut
  let sandbox
  // let testUser

  before(async () => {
    // Connect to the Mongo Database.
    console.log(`Connecting to database: ${config.database}`)
    mongoose.Promise = global.Promise
    mongoose.set('useCreateIndex', true) // Stop deprecation warning.
    await mongoose.connect(config.database, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new UserRPC()
    uut.rateLimit = new RateLimit({ max: 100 })
  })

  afterEach(() => sandbox.restore())

  after(() => {
    mongoose.connection.close()
  })

  // TODO
  describe('#readAll', () => {
    it('should implement tests', () => {
      assert.equal(1, 1)
    })
  })
})
