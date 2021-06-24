/*
  Mocks for the local-db Adapter library, used by tests for Use Cases
*/

class LocalDB {
  async doesEntryExist () {
    return {}
  }

  async insert () {
    return {}
  }
}

module.exports = LocalDB
