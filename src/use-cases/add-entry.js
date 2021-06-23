/*
  This is the Class Library for the write-entry use-case. This is when a user
  of this service wants to write a new Entry to the database. This is a different
  use case than a replication event triggered by a new entry from a peer database.
*/

const DBEntry = require('../entities/db-entry')

let _this

class AddEntry {
  constructor (localConfig = {}) {
    if (!localConfig.p2wdb) {
      throw new Error(
        'p2wdb instance must be included when instantiating AddEntry'
      )
    }
    this.p2wdb = localConfig.p2wdb

    if (!localConfig.localdb) {
      throw new Error(
        'localdb instance must be included when instantiating AddEntry'
      )
    }
    this.localdb = localConfig.localdb

    // Encapsulate dependencies.
    this.dbEntry = new DBEntry()

    _this = this
  }

  async add (rawData) {
    try {
      // Generate a validated entry by passing the raw data through input validation.
      const entry = _this.dbEntry.makeUserEntry(rawData)

      // Throw an error if the entry already exists.
      const exists = await _this.localdb.doesEntryExist(entry)
      if (exists) {
        throw new Error('Entry already exists in the database.')
      }

      // Add the entry to the P2WDB OrbitDB.
      const hash = await _this.p2wdb.insert(entry)
      entry.hash = hash
      entry.isValid = true

      // Add the entry to the local database (Mongo).
      await _this.localdb.insert(entry)

      return hash
    } catch (err) {
      console.error('Error in addEntry.add()')
      throw err
    }
  }
}

module.exports = AddEntry
