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
    it('should throw error if txid is not provided', async () => {
      try {
        await uut._validateTx()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'txid must be a string')
      }
    })

    it('should throw error if txid is not a string', async () => {
      try {
        await uut._validateTx(1)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'txid must be a string')
      }
    })

    it('should catch bchjs error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.Transaction, 'get')
          .throws(new Error('some error message'))

        const txId = mock.tx.txid
        await uut._validateTx(txId)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'some error message')
      }
    })

    it('should return false if txid is not a valid SLP tx', async () => {
      try {
        sandbox
          .stub(uut.bchjs.Transaction, 'get')
          .resolves({ isValidSLPTx: false })

        const txId = mock.tx.txid
        const result = await uut._validateTx(txId)
        assert.isFalse(result)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })

    it('should return false if tokenId does not match', async () => {
      try {
        sandbox
          .stub(uut.bchjs.Transaction, 'get')
          .resolves({ isValidSLPTx: true, tokenIid: 'wrong id' })

        const txId = mock.tx.txid
        const result = await uut._validateTx(txId)
        assert.isFalse(result)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })

    it('should return false if token burn is less than the threshold', async () => {
      try {
        const spy = sinon.spy(uut, 'getTokenQtyDiff')
        sandbox.stub(uut.bchjs.Transaction, 'get').resolves(mock.txInfo)

        const txId = mock.tx.txid
        const result = await uut._validateTx(txId)

        // Makes sure that the code gets to the functionality
        // that we want to validate
        assert.isTrue(
          spy.called,
          'Expected getTokenQtyDiff function to be called'
        )

        assert.isFalse(result)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })

    it('should return true if required tokens are burned', async () => {
      uut.config.reqTokenQty = 0
      sandbox.stub(uut.bchjs.Transaction, 'get').resolves(mock.txInfo)

      const txId = mock.tx.txid
      const result = await uut._validateTx(txId)
      assert.isTrue(result)
    })
  })

  describe('#getTokenQtyDiff', () => {
    it('should throw error if input is not provided', async () => {
      try {
        await uut.getTokenQtyDiff()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'txInfo is required')
      }
    })

    it('should throw error if txinfo is invalid format', async () => {
      try {
        await uut.getTokenQtyDiff(1)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'txInfo must contain vin and vout array')
      }
    })

    it('should get tokenqty difference between vin and vout arrays', async () => {
      try {
        const diff = await uut.getTokenQtyDiff(mock.txInfo)
        assert.isNumber(diff)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
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
