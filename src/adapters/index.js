/*
  This library file aggregates all the Adapters.
*/

// Individual adapter libraries.
const P2WDBAdapter = require('./p2wdb')
const p2wdb = new P2WDBAdapter()
const EntryAdapter = require('./entity')
const entry = new EntryAdapter()
const WebhookAdapter = require('./webhook')
const webhook = new WebhookAdapter()

module.exports = { p2wdb, entry, webhook }
