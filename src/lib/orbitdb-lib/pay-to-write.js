/*
  An npm JavaScript library for front end web apps. Implements a minimal
  Bitcoin Cash wallet.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

// Public npm libraries.
const OrbitDB = require('orbit-db')

// Local libraries
const wlogger = require('../wlogger')
const KeyValue = require('../../models/key-value')

// Define the pay-to-write access controller.
const AccessControllers = require('orbit-db-access-controllers')
const PayToWriteAccessController = require('./pay-to-write-access-controller')
AccessControllers.addAccessController({
  AccessController: PayToWriteAccessController
})

// let _this // local global for 'this'.

class PayToWriteDB {
  constructor (config) {
    // _this = this

    // Input Validation
    if (!config.ipfs) {
      throw new Error(
        'Must past an instance of ipfs when instantiationg the PayToWriteDB class.'
      )
    } else {
      this.ipfs = config.ipfs
    }

    this.db = {} // Instance of OrbitDB.
    this.KeyValue = KeyValue // Mongo model.

    // _this.util = util
  }

  // Returns the handle to a key-value store OrbitDB with pay-to-write
  // access control. The key is a BCH TXID that burned tokens, to pay for the
  // write.
  async createDb (dbName) {
    try {
      if (!dbName || typeof dbName !== 'string') {
        throw new Error('dbName must be a string')
      }

      const orbitdb = await OrbitDB.createInstance(this.ipfs, {
        // directory: "./orbitdb/examples/eventlog",
        directory: './orbitdb/dbs/keyvalue',
        AccessControllers: AccessControllers
      })

      const options = {
        accessController: {
          type: 'payToWrite',
          write: ['*']
        }
      }

      // Create the key-value store.
      this.db = await orbitdb.keyvalue(dbName, options)

      // Load data persisted to the hard drive.
      await this.db.load()

      return this.db
    } catch (err) {
      console.error('Error in createDb()')
      throw err
    }
  }

  // Read all entries in the OrbitDB.
  readAll () {
    try {
      // console.log('this.db: ', this.db)

      const allData = this.db.all

      return allData
    } catch (err) {
      wlogger.error('Error in pay-to-write.js/readAll()')
      throw err
    }
  }

  // Write an entry to the database. Returns true or false to indicate success or failure.
  async write (writeObj) {
    try {
      const { key, signature, message, data } = writeObj

      if (!key || typeof key !== 'string') {
        throw new Error('key must be a string')
      }
      if (!signature || typeof signature !== 'string') {
        throw new Error('signature must be a string')
      }
      if (!message || typeof message !== 'string') {
        throw new Error('message must be a string')
      }
      if (!data || typeof data !== 'string') {
        throw new Error('data must be a string')
      }

      // Check to see if the TXID already exists in the MongoDB.
      const mongoRes = await this.KeyValue.find({ key })
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
        message,
        data
      }

      console.log(
        `Adding key: ${key}, with value: ${JSON.stringify(dbKeyValue, null, 2)}`
      )

      // Add the entry to the Oribit DB
      const hash = await this.db.put(key, dbKeyValue)
      console.log('hash: ', hash)

      // Add the entry to the MongoDB if it passed the OrbitDB checks.
      const kvObj = {
        hash,
        key,
        value: dbKeyValue
      }
      const keyValue = new this.KeyValue(kvObj)
      await keyValue.save()

      return true
    } catch (err) {
      wlogger.error('Error in pay-to-write.js/write()')
      throw err
    }
  }
}

module.exports = PayToWriteDB
