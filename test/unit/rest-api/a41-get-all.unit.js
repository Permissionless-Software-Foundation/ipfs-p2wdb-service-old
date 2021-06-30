/*
  Unit tests for the get-all Controller library.
*/

const sinon = require('sinon')
const assert = require('chai').assert

// Unit under test (UUT)
const GetAll = require('../../../src/controllers/rest/entry/get-all')

// Mocks requred by UUT.
const adapters = require('../mocks/adapters')
const UseCasesMock = require('../mocks/use-cases')

let uut
let sandbox

describe('#get-all', () => {
  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new GetAll({ adapters, useCases })

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters not passed in', () => {
      try {
        uut = new GetAll()

        assert.fail('Unexpected code path.')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating PostEntry REST Controller.'
        )
      }
    })

    it('should throw an error if use-cases are not passed in', () => {
      try {
        uut = new GetAll({ adapters })

        assert.fail('Unexpected code path.')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating PostEntry REST Controller.'
        )
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
          .stub(uut.useCases.entry.readEntry, 'readAllEntries')
          .rejects(new Error('test error'))

        await uut.restController()
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
