/*
  This is the Class Library for the write-entry use-case. This is when a user
  of this service wants to write a new Entry to the database. This is a different
  use case than a replication event triggered by a new entry from a peer database.
*/

const DBEntry = require('../entities/db-entry')

class AddEntry {
  constructor (localConfig = {}) {
    this.p2wdb = localConfig.p2wdb
    this.localDb = localConfig.localDb

    // Encapsulate dependencies.
    this.dbEntry = new DBEntry()
  }

  async add (rawData) {
    try {
      // Generate a validated entry by passing the raw data through input validation.
      const entry = this.dbEntry.makeEntry(rawData)

      // Throw an error if the entry already exists.
      const exists = await this.localDb.doesEntryExist(entry)
      if (exists) {
        throw new Error('Entry already exists in the database.')
      }

      // Add the entry to the P2WDB OrbitDB.
      const hash = await this.p2wdb.insert(entry)

      // Add the entry to the local database (Mongo).
      await this.localDb.insert(entry)

      return hash
    } catch (err) {
      console.error('Error in addEntry()')
      throw err
    }
  }
}

module.exports = AddEntry
