/*
  Mocks for the Adapter library.
*/

const p2wdb = {
  ipfsAdapters: {
    ipfsCoordAdapter: {
      ipfsCoord: {}
    }
  },
  insert: async () => {}
}

const entry = {
  readEntry: {
    readAllEntries: () => {}
  },
  doesEntryExist: async () => {},
  insert: async () => {}
}

const webhook = () => {}

module.exports = { p2wdb, entry, webhook }
