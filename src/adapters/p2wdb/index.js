/*
  Adapter for the pay-to-write database (P2WDB).
  This library provides high-level abstraction for interacting with the P2WDB,
  which is composed of IPFS, ipfs-coord, and OrbitDB.

  This library sets of a series of asynchronous events in several other libraries.
  Here are a few design approaches adopted in this library:
  - When instantiating a new Class, the constructor should return immediately
    and have no side effects. e.g. it should not call an async function.
  - An async start() method is called to kick off any downstream libraries that
    need to be started.
  - An isReady flag can be checked to see if any dependency is in a ready state.
*/

const IpfsAdapters = require('../ipfs')
const OribitAdapter = require('../orbit')
const KeyValue = require('../../models/key-value')

let _this

class P2WDB {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.ipfsAdapters = new IpfsAdapters()
    this.KeyValue = KeyValue
    this.OribitAdapter = OribitAdapter
    // Properties of this class instance.
    this.isReady = false

    _this = this
  }

  // Start IPFS and OrbitDB.
  async start () {
    try {
      // Start IPFS and ipfs-coord
      await _this.ipfsAdapters.start()
      console.log('IPFS Adapters are all ready.')

      // Start the P2WDB OrbitDB.
      _this.orbit = new this.OribitAdapter({
        ipfs: this.ipfsAdapters.ipfs
      })
      await _this.orbit.start()
      console.log('OrbitDB Adapter is ready. P2WDB is ready.')

      _this.isReady = true

      console.log('The P2WDB is ready to use.')

      return _this.isReady
    } catch (err) {
      console.error('Error in adapters/p2wdb/index.js/start()')
      throw err
    }
  }

  // Insert a new entry into the database.
  // Returns the hash generated by OrbitDB for the new entry.
  async insert (entry) {
    try {
      console.log('entry: ', entry)

      // Add the entry to the Oribit DB
      const hash = await _this.orbit.db.put(entry.key, entry.value)
      console.log('hash: ', hash)

      return hash
    } catch (err) {
      console.error('Error in p2wdb.js/insert()')
      throw err
    }
  }

  // Read all entries in the P2WDB.
  async readAll () {
    try {
      const data = await _this.orbit.readAll()
      console.log('data: ', data)

      return data
    } catch (err) {
      console.error('Error in p2wdb.js/readAll()')
      throw err
    }
  }

  async readByHash (hash) {
    try {
      console.log('hash: ', hash)

      // Note: No good way listed in API reference for getting entry by hash from
      // OrbitDB directly.
      // https://github.com/orbitdb/orbit-db/blob/main/API.md
      // const data = _this.orbit.db.get(hash)

      // Get an entry from MongoDB.
      const data = await _this.KeyValue.findOne({ hash })
      console.log('data: ', data)

      return data
    } catch (err) {
      console.error('Error in p2wdb.js/readByHash()')
      throw err
    }
  }

  async readByTxid (txid) {
    try {
      console.log('txid: ', txid)
      // const data = _this.orbit.db.get(txid)

      // Find the data in the local database
      const data = await _this.KeyValue.findOne({ key: txid })
      console.log('data: ', data)

      return data
    } catch (err) {
      console.error('Error in p2wdb.js/readByTxid()')
      throw err
    }
  }

  async readByAppId (appId) {
    try {
      // console.log('appId: ', appId)
      // const data = _this.orbit.db.get(txid)

      // Find the data in the local database
      const data = await _this.KeyValue.find({ appId })
      console.log('data: ', data)

      return data
    } catch (err) {
      console.error('Error in p2wdb.js/readByAppId()')
      throw err
    }
  }
}

module.exports = P2WDB
