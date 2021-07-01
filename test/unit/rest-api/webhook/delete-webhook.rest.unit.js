/*
  Unit tests for the delete-webhook REST API controller.
*/

// Public npm libraries
const sinon = require('sinon')
const assert = require('chai').assert

// UUT
const DeleteWebhook = require('../../../../src/controllers/rest/webhook/delete-webhook')

// Mocks
const adaptersMock = require('../../mocks/adapters')
const UseCasesMock = require('../../mocks/use-cases')

describe('#REST-DeleteWebhook', () => {
  let uut
  let useCasesMock
  let webhookData = {}
  let sandbox

  beforeEach(() => {
    useCasesMock = new UseCasesMock()

    uut = new DeleteWebhook({
      adapters: adaptersMock,
      useCases: useCasesMock
    })

    webhookData = {
      url: 'http://test.com',
      appId: 'test'
    }

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not included.', () => {
      try {
        uut = new DeleteWebhook()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating DeleteWebhook REST Controller.'
        )
      }
    })

    it('should throw an error if use-cases instance are not included.', () => {
      try {
        uut = new DeleteWebhook({ adapters: adaptersMock })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating DeleteWebhook REST Controller.'
        )
      }
    })
  })

  describe('#restController', () => {
    it('body should return the success of the use case', async () => {
      // Mock dependencies
      sandbox.stub(uut.useCases.webhook, 'remove').resolves(true)

      const ctx = {
        request: {
          body: webhookData
        }
      }
      await uut.restController(ctx)
      // console.log('ctx: ', ctx)

      // Assert that the body data contains the data from the use-case mock.
      assert.property(ctx.body, 'success')
      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.webhook, 'remove')
          .rejects(new Error('test error'))

        const ctx = {
          request: {
            body: webhookData
          }
        }
        await uut.restController(ctx)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#routeHandler', () => {
    it('should route to the rest controller', async () => {
      // Mock the actual controller.
      sandbox.stub(uut, 'restController').resolves({})

      await uut.routeHandler()
    })

    it('should return 422 status on error', async () => {
      try {
        // Force an error
        sandbox.stub(uut, 'restController').rejects(new Error('test error'))

        // Mock the ctx.throw() function.
        const ctx = {
          throw: (status, message) => {
            throw new Error(`status: ${status}, message: ${message}`)
          }
        }

        await uut.routeHandler(ctx)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, '422')
        assert.include(err.message, 'test error')
      }
    })
  })
})
