const KeyValue = require('../../models/key-value')

const IPFS = require('ipfs')
const PayToWriteDB = require('../../lib/orbitdb-lib/pay-to-write')

const config = require('../../../config')

let _this

class PTWDBController {
  constructor () {
    _this = this

    // Encapsulate dependencies
    this.KeyValue = KeyValue
    this.config = config
    this.ipfs = {}
    this.ptwDb = {}

    // Returns a Promise that resolves to `true` when the database is ready.
    // this.dbIsReady = this.startIpfs()``
  }

  async startIpfs () {
    try {
      this.ipfs = await IPFS.create()

      const config = {
        ipfs: this.ipfs
      }
      this.ptwDb = new PayToWriteDB(config)

      this.db = await this.ptwDb.createDb(this.config.orbitDbName)

      return true
    } catch (err) {
      console.log('Error while trying to start IPFS: ', err)
      // Do not throw error.
    }
  }

  /*
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "txid": "038b63aa3b1fc8d6ca6043ce577410e8d0bdd9189a3f07d4e0d8f32274e1ddc0", "message": "test", "signature": "H+KlUnu+Eg6599g0S+pb1VHCLb6+ga9K05U+3T5dSu0qAR0I6DeoUe8LRyO+td4f5OhBIK8iFFcDoRsmEt/VfLw=" }' localhost:5001/ptwdb
   */
  async writeToDb (ctx) {
    try {
      const key = ctx.request.body.txid
      const signature = ctx.request.body.signature
      const message = ctx.request.body.message

      if (!key || typeof key !== 'string') {
        throw new Error('txid must be a string')
      }
      if (!signature || typeof signature !== 'string') {
        throw new Error('signature must be a string')
      }
      if (!message || typeof message !== 'string') {
        throw new Error('message must be a string')
      }

      // Check to see if the TXID already exists in the MongoDB.
      const mongoRes = await _this.KeyValue.find({ key })
      if (mongoRes.length > 0) {
        // console.log(`mongoRes: `, mongoRes)
        const mongoKey = mongoRes[0].key

        if (mongoKey === key) {
          // Entry is already in the database.
          throw new Error('Entry already in database')
        }
      }

      // key value
      const dbKeyValue = {
        signature,
        message
      }

      console.log(
        `Adding key: ${key}, with value: ${JSON.stringify(dbKeyValue, null, 2)}`
      )

      // Add the entry to the Oribit DB
      const hash = await _this.db.put(key, dbKeyValue)
      console.log('hash: ', hash)

      // Add the entry to the MongoDB if it passed the OrbitDB checks.
      const kvObj = {
        hash,
        key,
        value: dbKeyValue
      }
      const keyValue = new _this.KeyValue(kvObj)
      await keyValue.save()

      ctx.body = {
        success: true
      }
    } catch (err) {
      console.error(err)
      ctx.throw(422, err.message)
    }
  }

  readAll (ctx) {
    try {
      const allData = _this.db.all

      ctx.body = {
        success: true,
        data: allData
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = PTWDBController
