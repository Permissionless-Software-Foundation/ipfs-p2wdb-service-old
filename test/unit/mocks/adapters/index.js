/*
  Mocks for the Adapter library.
*/

const p2wdb = {
  ipfsAdapters: {
    ipfsCoordAdapter: {
      ipfsCoord: {}
    }
  }
}

const entry = {
  readEntry: {
    readAllEntries: () => {}
  }
}

const webhook = () => {}

module.exports = { p2wdb, entry, webhook }
