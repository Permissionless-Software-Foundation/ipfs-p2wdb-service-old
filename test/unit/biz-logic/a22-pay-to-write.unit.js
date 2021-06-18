/*
  Unit tests for the pay-to-write.js library.
*/

const sinon = require('sinon')
const assert = require('chai').assert

const PayToWriteDB = require('../../../src/lib/orbitdb-lib/pay-to-write')
const KeyValueMock = require('../mocks/model-mock.js')
const OrbitDBMock = require('../mocks/orbitdb-mock')

let uut
let sandbox

describe('#PayToWrite', () => {
  beforeEach(() => {
    uut = new PayToWriteDB({ ipfs: {} })

    // Mock database dependencies.
    uut.db = new OrbitDBMock()
    uut.KeyValue = KeyValueMock

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    // TODO
    it('should throw an error if instance of IPFS is not provided', () => {
      assert.equal(1, 1)
    })
  })

  describe('#createDb', () => {
    // TODO
    it('should throw an error if dbName is not provided.', async () => {
      assert.equal(1, 1)
    })
  })

  describe('#handleReplicateEvent', () => {
    // TODO
    it('should test this function', () => {
      assert.equal(1, 1)
    })
  })

  describe('#readAll', () => {
    it('should read all data from the database', () => {
      const result = uut.readAll()

      assert.isObject(result)
    })

    // TODO
    it('should catch and throw errors', () => {
      assert.equal(1, 1)
    })
  })

  describe('#write', () => {
    it('should throw error if txid is not provided', async () => {
      try {
        const writeObj = {
          signature:
            'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
          message: 'A message'
        }

        await uut.write(writeObj)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'key must be a string')
      }
    })

    it('should throw error if signature is not provided', async () => {
      try {
        const writeObj = {
          key:
            '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
          message: 'A message'
        }

        await uut.write(writeObj)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'signature must be a string')
      }
    })

    it('should throw error if message is not provided', async () => {
      try {
        const writeObj = {
          key:
            '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
          signature:
            'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='
        }

        await uut.write(writeObj)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'message must be a string')
      }
    })

    it('should throw error if data is not provided', async () => {
      try {
        const writeObj = {
          key:
            '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
          signature:
            'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
          message: 'A message'
        }

        await uut.write(writeObj)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'data must be a string')
      }
    })

    it('should return true if can append into the db', async () => {
      const writeObj = {
        key: '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
        signature:
          'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
        message: 'A message',
        data: 'Some test data'
      }

      const result = await uut.write(writeObj)
      // console.log('result: ', result)

      // Function should return an object with the following properties.
      assert.property(result, 'hash')
      assert.property(result, 'success')
      assert.property(result, 'key')
      assert.property(result, 'value')

      // Function should return true if entry was successfully added to the
      // database.
      assert.equal(true, result.success)
    })

    it('should throw error if entry already in db', async () => {
      try {
        const writeObj = {
          key:
            '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
          signature:
            'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
          message: 'A message',
          data: 'Some test data'
        }

        // Force database to return the same value.
        sandbox.stub(uut.KeyValue, 'find').resolves([writeObj])

        await uut.write(writeObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Entry already in database')
      }
    })
  })
})
