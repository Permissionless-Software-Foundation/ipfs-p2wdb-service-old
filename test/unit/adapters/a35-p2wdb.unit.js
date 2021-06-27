/*
  Unit tests for the p2wdb adapter library.
*/

const sinon = require('sinon')
const assert = require('chai').assert

// const P2WDB = require('../../../src/adapters/p2wdb')

// let uut
let sandbox

describe('#p2wdb', () => {
  beforeEach(() => {
    // uut = new P2WDB()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#start', () => {
    it('should catch and throw errors', () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return true after the database has started', () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#insert', () => {
    it('should add a key-value to the orbit database and return a hash', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should catch and throw an error', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })
})
