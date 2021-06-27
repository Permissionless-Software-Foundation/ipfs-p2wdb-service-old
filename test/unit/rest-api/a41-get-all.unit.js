/*
  Unit tests for the get-all Controller library.
*/

const sinon = require('sinon')
const assert = require('chai').assert

// Unit under test (UUT)
const GetAll = require('../../../src/controllers/rest/get-all')

// Mocks requred by UUT.
const ReadEntry = require('../mocks/use-cases/read-entry.mock')

let uut
let sandbox

describe('#get-all', () => {
  beforeEach(() => {
    const getEntries = new ReadEntry()
    uut = new GetAll({ getEntries })

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if get-entries use case is not passed in', () => {
      try {
        uut = new GetAll()

        assert.fail('Unexpected code path.')
      } catch (err) {
        assert.include(err.message, 'get-entries use case required.')
      }
    })
  })

  describe('#restController', () => {
    it('body should contain data', async () => {
      const ctx = {}
      await uut.restController(ctx)
      // console.log('ctx: ', ctx)

      // Assert that the body data contains the data from the use-case mock.
      assert.property(ctx.body.data, 'key1')
      assert.equal(ctx.body.data.key1, 'value1')
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.getEntries, 'readAllEntries')
          .rejects(new Error('test error'))

        await uut.restController()
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
