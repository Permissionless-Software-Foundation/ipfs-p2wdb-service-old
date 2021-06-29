/*
  This library file aggregates all the Adapters.
*/

// Individual adapter libraries.
const P2WDB = require('../adapters/p2wdb')
const p2wdb = new P2WDB()
const LocalDB = require('../adapters/local-db')
const localdb = new LocalDB()
const Webhook = require('./webhook')
const webhook = new Webhook()

module.exports = { p2wdb, localdb, webhook }
