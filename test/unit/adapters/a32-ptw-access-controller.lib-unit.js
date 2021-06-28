/*
  Unit tests for the pay-to-write access controller for OrbitDB.
*/

const assert = require('chai').assert

const PayToWriteAccessController = require('../../../src/adapters/orbit/pay-to-write-access-controller')

const sinon = require('sinon')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }
const mock = require('../mocks/pay-to-write-mock')

let sandbox
let uut

describe('#PayToWriteAccessController', () => {
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

    it('should repackage errors from bch-api as an Error object', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .rejects({ error: 'some error message' })

        const txId =
          'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0'
        const signature =
          'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='
        const message = 'A message'

        await uut._validateSignature(txId, signature, message)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'some error message')
      }
    })

    it('should return true for valid signature', async () => {
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
    })
  })

  describe('#_validateTx', () => {
    it('should catch and throw an error', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return false if txid is not a valid SLP tx', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return false if tokenId does not match', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return false if token burn is less than the threshold', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return true if required tokens are burned', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#markInvalid', () => {
    it('should catch and throw an error', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should create a new entry in MongoDB', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#matchErrorMsg', () => {
    it('should return false if no error message is matched', () => {
      const result = uut.matchErrorMsg('test message')

      assert.equal(result, false)
    })

    it('should return true for no-tx error', () => {
      const result = uut.matchErrorMsg(
        'No such mempool or blockchain transaction'
      )

      assert.equal(result, true)
    })
  })

  describe('#validateAgainstBlockchain', () => {
    it('should catch and throw a general error', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should catch known error messages and mark the entry as invalid in Mongo', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return false for invalid signature', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return return true on successful validation', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#canAppend', () => {
    it('should return false if the input data is greater than the maxDataSize', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return value in MongoDB if entry already exists in the database', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return true if blockchain validation passes', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })
})
