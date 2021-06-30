/*
  This is the Class Library for the write-entry use-case. This is when a user
  of this service wants to write a new Entry to the database. This is a different
  use case than a replication event triggered by a new entry from a peer database.
*/

const DBEntry = require('../entities/db-entry')

let _this

class AddEntry {
  constructor (localConfig = {}) {
    if (!localConfig.p2wdbAdapter) {
      throw new Error(
        'p2wdbAdapter instance must be included when instantiating AddEntry'
      )
    }
    this.p2wdbAdapter = localConfig.p2wdbAdapter

    if (!localConfig.entryAdapter) {
      throw new Error(
        'entryAdapter instance must be included when instantiating AddEntry'
      )
    }
    this.entryAdapter = localConfig.entryAdapter

    // Encapsulate dependencies.
    this.dbEntry = new DBEntry()

    _this = this
  }

  async addUserEntry (rawData) {
    try {
      // Generate a validated entry by passing the raw data through input validation.
      const entry = _this.dbEntry.makeUserEntry(rawData)

      // Throw an error if the entry already exists.
      const exists = await _this.entryAdapter.doesEntryExist(entry)
      if (exists) {
        throw new Error('Entry already exists in the database.')
      }

      // Add the entry to the P2WDB OrbitDB.
      const hash = await _this.p2wdbAdapter.insert(entry)
      entry.hash = hash
      entry.isValid = true

      // Note: Inserting the entry into the P2WDB will trigger the
      // ValidationSucceeded event. This event will automatically add the entry
      // to the local MongoDB.

      return hash
    } catch (err) {
      console.error('Error in addEntry.add()')
      throw err
    }
  }

  async addPeerEntry (peerData) {
    // console.log('Entering addPeerEntry() with this data: ', peerData)

    const entry = _this.dbEntry.makePeerEntry(peerData)

    // Throw an error if the entry already exists.
    const exists = await _this.entryAdapter.doesEntryExist(entry)
    if (exists) {
      throw new Error('Entry already exists in the database.')
    }

    // The entry already exists in the P2WDB OrbitDB, so nothing needs to be
    // done on that front.

    // Add the entry to the local database (Mongo).
    await _this.entryAdapter.insert(entry)

    return true
  }
}

module.exports = AddEntry
