/*
  Unit tests for the pay-to-write.js library.
*/

const sinon = require('sinon')
const assert = require('chai').assert

const OrbitDBAdapter = require('../../../src/adapters/orbit')
const KeyValueMock = require('../mocks/model-mock.js')
const OrbitDBMock = require('../mocks/orbitdb-mock')

let uut
let sandbox

describe('#PayToWrite', () => {
  beforeEach(() => {
    uut = new OrbitDBAdapter({ ipfs: {} })

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
    it('should use default db name in config file if name is not provided', async () => {
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
})
