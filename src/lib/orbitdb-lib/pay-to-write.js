/*
  An npm JavaScript library for front end web apps. Implements a minimal
  Bitcoin Cash wallet.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

// const Util = require('./lib/util')
// const util = new Util()

const OrbitDB = require('orbit-db')

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
}

module.exports = PayToWriteDB
