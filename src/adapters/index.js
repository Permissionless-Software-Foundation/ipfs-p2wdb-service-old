/*
  This library file aggregates all the Adapters.
*/

// Individual adapter libraries.
const P2WDB = require('../adapters/p2wdb')
const LocalDB = require('../adapters/local-db')

class Adapters {
  constructor () {
    this.p2wdb = new P2WDB()
    this.localdb = new LocalDB()
  }
}

module.exports = Adapters
