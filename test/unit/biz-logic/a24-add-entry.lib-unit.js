/*
  Unit tests for the P2WDB Add Entry Use Case
*/

const assert = require('chai').assert
const sinon = require('sinon')

const AddEntry = require('../../../src/use-cases/add-entry')

// Mocks
const LocalDB = require('../mocks/localdb-mock')
const P2WDB = require('../mocks/p2wdb-mock')

let sandbox
let uut
let rawData

describe('#AddEntry', () => {
  before(async () => {})

  beforeEach(() => {
    const localdb = new LocalDB()
    const p2wdb = new P2WDB()
    uut = new AddEntry({ p2wdb, localdb })

    rawData = {
      hash: 'zdpuAuxCW346zUG71Aai21Y31EJ1XNxcjXV5rz93DxftKnpjn',
      txid: '0fc58bdd91ff92cb47387d950a505d934b3776a1b2544ea9b53102d4697ef91f',
      message: 'test',
      signature:
        'IA8LCUnN6TUocSGnCe9nA1T4D+9hurJJ0vi3vBEJvAVwFfGcZ9ZlIWdR1m30wAxO4r0wb3YSzrM3QynpfgKUW/w=',
      data:
        '{"appId":"test","title":"7170","sourceUrl":"63156","ipfsUrl":"73680","timestamp":"2021-06-23T00:26:51.789Z","localTimestamp":"6/22/2021, 5:26:51 PM"}'
    }

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if p2wdb instance is not included', () => {
      try {
        uut = new AddEntry()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'p2wdb instance must be included when instantiating AddEntry'
        )
      }
    })

    it('should throw an error if localdb instance is not included', () => {
      try {
        uut = new AddEntry({ p2wdb: {} })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'localdb instance must be included when instantiating AddEntry'
        )
      }
    })
  })

  describe('#addUserEntry', () => {
    it('should throw an error if entry already exists in the database.', async () => {
      try {
        // Mock dependencies.
        sandbox.stub(uut.localdb, 'doesEntryExist').resolves(true)

        await uut.addUserEntry(rawData)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Entry already exists in the database.')
      }
    })

    it('should add an entry to the P2WDB', async () => {
      // Mock dependencies
      sandbox.stub(uut.localdb, 'doesEntryExist').resolves(false)
      sandbox.stub(uut.p2wdb, 'insert').resolves('test-hash')

      const result = await uut.addUserEntry(rawData)

      assert.equal(result, 'test-hash')
    })
  })

  describe('#addPeerEntry', () => {
    it('should throw an error if entry already exists in the database.', async () => {
      try {
        // Mock dependencies.
        sandbox.stub(uut.localdb, 'doesEntryExist').resolves(true)

        await uut.addPeerEntry(rawData)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Entry already exists in the database.')
      }
    })

    it('should add an entry to the P2WDB', async () => {
      // Mock dependencies
      sandbox.stub(uut.localdb, 'doesEntryExist').resolves(false)

      const result = await uut.addPeerEntry(rawData)

      assert.equal(result, true)
    })
  })
})
