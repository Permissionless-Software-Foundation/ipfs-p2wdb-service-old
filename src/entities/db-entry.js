/*
  This is the Class Library for the Database Entry Entitity. This is a top-level
  entity as per the Clean Architecture pattern.
*/

class DBEntry {
  // constructor (localConfig) {}

  makeEntry ({ hash, key, value, isValid = false } = {}) {
    // if (!hash || typeof hash !== 'string') {
    //   throw new Error('Entry requires OrbitDB hash string.')
    // }

    if (!key || typeof key !== 'string') {
      throw new Error('Entry key must be a TXID string of proof-of-burn.')
    }

    if (!value) {
      throw new Error('Entry requires an value property.')
    }

    const entry = {
      hash,
      key,
      value,
      isValid
    }

    return entry
  }
}

module.exports = DBEntry
