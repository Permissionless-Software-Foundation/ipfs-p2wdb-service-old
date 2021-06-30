/*
  Unit tests for the Webhook Adapter
*/

const sinon = require('sinon')
const assert = require('chai').assert

const WebhookAdapter = require('../../../src/adapters/webhook')

describe('#WebhookAdapter', () => {
  let uut
  let sandbox

  beforeEach(() => {
    uut = new WebhookAdapter()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#validationSucceededEventHandler', () => {
    it('should exit quietly if data can not be parsed into JSON', async () => {
      const eventData = {
        data: 'some data'
      }

      await uut.validationSucceededEventHandler(eventData)

      // Not throwing an error is a pass.
      // Looking at the code coverage report is how to check if this test case
      // is working properly.
      assert.equal(1, 1)
    })

    it('should exit quietly if data does not contain an appID', async () => {
      const eventData = {
        data: '{"title":"83214","sourceUrl":"69834"}'
      }

      await uut.validationSucceededEventHandler(eventData)

      // Not throwing an error is a pass.
      // Looking at the code coverage report is how to check if this test case
      // is working properly.
      assert.equal(1, 1)
    })

    it('should trigger a webhook if one exists in the database with a matching appID', async () => {
      const eventData = {
        data: '{"appId":"test","title":"83214","sourceUrl":"69834"}'
      }

      // Mock dependendent functions
      // Force the database to return a match.
      sandbox.stub(uut.WebhookModel, 'find').returns(['a'])
      // mock the trigger function.
      sandbox.stub(uut, 'triggerWebhook').resolves({})

      await uut.validationSucceededEventHandler(eventData)

      // Not throwing an error is a pass.
      // Looking at the code coverage report is how to check if this test case
      // is working properly.
      assert.equal(1, 1)
    })

    it('should report but not throw an error', async () => {
      await uut.validationSucceededEventHandler()

      // Not throwing an error is a pass.
      // Looking at the code coverage report is how to check if this test case
      // is working properly.
      assert.equal(1, 1)
    })
  })

  describe('#triggerWebhook', () => {
    it('should trigger a webhook', async () => {
      const matches = ['a']

      await uut.triggerWebhook(matches)
    })
  })

  describe('#addWebhook', async () => {
    it('should add new webhook model to the database', async () => {
      // Mock database dependencies.
      uut.WebhookModel = WebhookModelMock

      const data = {
        url: 'http://test.com',
        appId: 'test'
      }

      const result = await uut.addWebhook(data)
      // console.log(result)

      assert.equal(result, '123')
    })
  })
})

class WebhookModelMock {
  constructor (obj) {
    this._id = '123'
  }

  save () {}
}
