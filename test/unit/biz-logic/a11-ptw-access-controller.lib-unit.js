/*
  Unit tests for the pay-to-write access controller for OrbitDB.
*/

const assert = require('chai').assert

const PayToWriteAccessController = require('../../../src/lib/orbitdb-lib/pay-to-write-access-controller')

const sinon = require('sinon')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }
const mock = require('../mocks/pay-to-write-mock')

let sandbox
let uut

describe('PayToWriteAccessController', () => {
  before(async () => {})

  beforeEach(() => {
    uut = new PayToWriteAccessController()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('_validateSignature()', () => {
    it('should throw error if txid input is not provided', async () => {
      try {
        await uut._validateSignature()

        assert(false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'txid must be a string')
      }
    })

    it('should throw error if signature input is not provided', async () => {
      try {
        const txId =
          'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0'
        await uut._validateSignature(txId)

        assert(false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'signature must be a string')
      }
    })

    it('should throw error if message input is not provided', async () => {
      try {
        const txId =
          'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0'
        const signature =
          'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='

        await uut._validateSignature(txId, signature)

        assert(false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'message must be a string')
      }
    })

    it('should return false for invalid signature', async () => {
      try {
        // Mock
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(mock.tx)

        const txId =
          'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0'
        const signature =
          'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='
        const message = 'wrong message'

        const result = await uut._validateSignature(txId, signature, message)

        assert.isFalse(result)
      } catch (err) {
        assert(false, 'Unexpected result')
      }
    })

    it('should return true for valid signature', async () => {
      try {
        // Mock
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(mock.tx)

        const txId =
          'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0'
        const signature =
          'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='
        const message = 'A message'

        const result = await uut._validateSignature(txId, signature, message)

        assert.isTrue(result)
      } catch (err) {
        assert(false, 'Unexpected result')
      }
    })
  })
})
