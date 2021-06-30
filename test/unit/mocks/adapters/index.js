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

const webhook = {
  addNewWebhook: async () => {}
}

module.exports = { p2wdb, entry, webhook }
