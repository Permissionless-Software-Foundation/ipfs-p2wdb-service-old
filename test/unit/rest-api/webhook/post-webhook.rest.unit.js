/*
  Unit tests for the post-webhook REST API controller.
*/

// Public npm libraries
const sinon = require('sinon')
const assert = require('chai').assert

// UUT
const PostWebhook = require('../../../../src/controllers/rest/webhook/post-webhook')

// Mocks
const adaptersMock = require('../../mocks/adapters')
const UseCasesMock = require('../../mocks/use-cases')

describe('#PostWebhook', () => {
  let uut
  let useCasesMock
  let webhookData = {}
  let sandbox

  beforeEach(() => {
    useCasesMock = new UseCasesMock()

    uut = new PostWebhook({
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
        uut = new PostWebhook()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating PostEntry REST Controller.'
        )
      }
    })

    it('should throw an error if use-cases instance are not included.', () => {
      try {
        uut = new PostWebhook({ adapters: adaptersMock })

        assert.fail('Unexpected code path')
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
      // Mock dependencies
      sandbox
        .stub(uut.useCases.webhook.addWebhook, 'addNewWebhook')
        .resolves('123')

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
      assert.property(ctx.body, 'id')
      assert.equal(ctx.body.id, '123')
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.webhook.addWebhook, 'addNewWebhook')
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
})
