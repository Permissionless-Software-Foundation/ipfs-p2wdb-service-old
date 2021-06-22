// Use Case libraries
const AddEntry = require('./add-entry')

// Adapters
const P2WDB = require('../adapters/p2wdb')
const p2wdb = new P2WDB()
const LocalDB = require('../adapters/local-db')
const localdb = new LocalDB()

// Start all the non-REST controllers for the P2WDB. This includes IPFS,
// ipfs-coord, JSON RPC over IPFS, and OrbitDB with the custom access controller.
async function startP2wdb () {
  try {
    await p2wdb.start()
  } catch (err) {
    console.error('Error in controllers/index.js/startP2wdb()')
    throw err
  }
}
startP2wdb()

const addEntry = new AddEntry({
  p2wdb,
  localdb
})

module.exports = {
  addEntry
}
