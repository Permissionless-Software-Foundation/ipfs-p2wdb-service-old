/*
  This is the Class Library for the Database Entry Entitity. This is a top-level
  entity as per the Clean Architecture pattern.
*/

class DBEntry {
  // constructor (localConfig) {}

  makeEntry ({ hash, txid, data, signature, message, isValid = false } = {}) {
    // if (!hash || typeof hash !== 'string') {
    //   throw new Error('Entry requires OrbitDB hash string.')
    // }

    if (!txid || typeof txid !== 'string') {
      throw new Error(
        'TXID must be a string containing a transaction ID of proof-of-burn.'
      )
    }

    if (!data) {
      throw new Error('Entry requires an data property.')
    }

    const key = txid
    const value = {
      message,
      signature,
      data
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
