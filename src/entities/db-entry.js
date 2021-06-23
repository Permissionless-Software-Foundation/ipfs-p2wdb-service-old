/*
  This is the Class Library for the Database Entry Entitity. This is a top-level
  entity as per the Clean Architecture pattern.
*/

class DBEntry {
  // constructor (localConfig) {}

  // Make a new P2WDB Entry based on data passed by a user, from the one of
  // the interfaces.
  makeUserEntry ({
    hash,
    txid,
    data,
    signature,
    message,
    isValid = false
  } = {}) {
    // Input validation.
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

  // Make a new P2WDB entry based on a replication event from data added by a
  // peer database on the network
  // makePeerEntry() {}
}

module.exports = DBEntry
