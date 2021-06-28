/*
  Unit tests for the localdb adapter library.
*/

const sinon = require('sinon')
const assert = require('chai').assert

// const LocalDB = require('../../../src/adapters/local-db')

// let uut
let sandbox

describe('#local-db', () => {
  beforeEach(() => {
    // uut = new LocalDB()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#doesEntryExist', () => {
    it('should return false if entry is not in the database.', () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should return true if entry is already in the database.', () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should catch and throw an error', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#insert', () => {
    it('should add an entry to the database and return the _id value', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should catch and throw an error', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })
})
