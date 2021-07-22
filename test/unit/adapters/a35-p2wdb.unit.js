/*
  Unit tests for the p2wdb adapter library.
*/

const sinon = require('sinon')
const assert = require('chai').assert
const mongoose = require('mongoose')

// Local support libraries
const config = require('../../../config')
const P2WDB = require('../../../src/adapters/p2wdb')
const KeyValue = require('../../../src/models/key-value')
const OrbitDBAdapterMock = require('../mocks/orbitdb-mock').OrbitDBAdapterMock

let uut
let sandbox

describe('#p2wdb', () => {
  before(async () => {
    // Connect to the Mongo Database.
    console.log(`Connecting to database: ${config.database}`)
    mongoose.Promise = global.Promise
    mongoose.set('useCreateIndex', true) // Stop deprecation warning.

    await mongoose.connect(
      config.database,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    )

    // Entry for test
    const entry = new KeyValue({
      key: 'txid',
      hash: 'hash',
      appId: 'appid',
      value: { test: 'test' }
    })
    await entry.save()
  })
  beforeEach(() => {
    uut = new P2WDB()
    uut.orbit = new OrbitDBAdapterMock()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())
  after(() => {
    mongoose.connection.close()
  })
  describe('#start', () => {
    it('should catch and throw errors', async () => {
      try {
        sandbox
          .stub(uut.ipfsAdapters, 'start')
          .throws(new Error('test error'))

        await uut.start()
        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })

    it('should return true after the database has started', async () => {
      sandbox
        .stub(uut.ipfsAdapters, 'start')
        .resolves(true)

      // mocking orbit db adapter
      uut.OribitAdapter = OrbitDBAdapterMock

      const result = await uut.start()
      assert.isTrue(result)
      assert.isTrue(uut.isReady)
    })
  })

  describe('#insert', () => {
    it('should add a key-value to the orbit database and return a hash', async () => {
      const entry = { key: 'key', value: 'value' }
      const hash = await uut.insert(entry)
      assert.isString(hash)
    })

    it('should catch and throw an error', async () => {
      try {
        sandbox
          .stub(uut.orbit.db, 'put')
          .throws(new Error('test error'))

        const entry = { key: 'key', value: 'value' }
        await uut.insert(entry)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#readAll', () => {
    it('should get all entries in the P2WDB', async () => {
      const data = await uut.readAll()
      assert.isObject(data)
    })

    it('should catch and throw an error', async () => {
      try {
        sandbox
          .stub(uut.orbit, 'readAll')
          .throws(new Error('test error'))

        await uut.readAll()

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#readByHash', () => {
    it('should get entry by hash', async () => {
      const hash = 'hash'
      const result = await uut.readByHash(hash)
      assert.isObject(result)
    })

    it('should get null if hash not found', async () => {
      const hash = 'unknow hash'
      const result = await uut.readByHash(hash)
      assert.isNull(result)
    })
    it('should return null if input is not provided', async () => {
      const result = await uut.readByHash()
      assert.isNull(result)
    })

    it('should catch and throw an error', async () => {
      try {
        sandbox
          .stub(uut.KeyValue, 'findOne')
          .throws(new Error('test error'))

        const hash = 'hash'
        await uut.readByHash(hash)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#readByTxid', () => {
    it('should get entry by txid', async () => {
      const txid = 'txid'
      const result = await uut.readByTxid(txid)
      assert.isObject(result)
    })

    it('should get null if txid not found', async () => {
      const txid = 'unknow txid'
      const result = await uut.readByTxid(txid)
      assert.isNull(result)
    })
    it('should return null if input is not provided', async () => {
      const result = await uut.readByTxid()
      assert.isNull(result)
    })

    it('should catch and throw an error', async () => {
      try {
        sandbox
          .stub(uut.KeyValue, 'findOne')
          .throws(new Error('test error'))

        const hash = 'hash'
        await uut.readByTxid(hash)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
  describe('#readByAppId', () => {
    it('should get entries by appId', async () => {
      const appId = 'appid'
      const result = await uut.readByAppId(appId)
      assert.isArray(result)
      assert(result.length > 0)
    })

    it('should get empty array if appId not found', async () => {
      const appId = 'unknow appid'
      const result = await uut.readByAppId(appId)
      assert.isArray(result)
      assert.isEmpty(result)
    })
    it('should return empty array if input is not provided', async () => {
      const result = await uut.readByAppId()
      assert.isArray(result)
      assert.isEmpty(result)
    })

    it('should catch and throw an error', async () => {
      try {
        sandbox
          .stub(uut.KeyValue, 'find')
          .throws(new Error('test error'))

        const hash = 'hash'
        await uut.readByAppId(hash)

        assert.fail('unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
