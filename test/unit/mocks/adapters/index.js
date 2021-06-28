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
const localdb = () => {}

module.exports = { p2wdb, localdb }
