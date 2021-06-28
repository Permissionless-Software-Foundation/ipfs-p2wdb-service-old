/*
  This is the Class Library for the read-entry use-cases. This is when a user
  of this service wants to read an Entry or Entries from the database.
*/

// const DBEntry = require('../entities/db-entry')

// let _this

class ReadEntry {
  constructor (localConfig = {}) {
    if (!localConfig.p2wdb) {
      throw new Error(
        'p2wdb instance must be included when instantiating ReadEntry'
      )
    }
    this.p2wdb = localConfig.p2wdb

    // _this = this
  }

  // Read all entries in the P2WDB.
  async readAllEntries () {
    try {
      const data = await this.p2wdb.readAll()

      return data
    } catch (err) {
      console.error('Error in readAllEntries()')
      throw err
    }
  }
}

module.exports = ReadEntry
