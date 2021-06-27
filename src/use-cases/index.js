// Individual Use Case libraries
const AddEntry = require('./add-entry')
const ReadEntry = require('./read-entry')

// Adapters
// const P2WDB = require('../adapters/p2wdb')
// const p2wdb = new P2WDB()
// const LocalDB = require('../adapters/local-db')
// const localdb = new LocalDB()
const Adapters = require('../adapters')
const adapters = new Adapters()

// Instantiate the Use Cases
const addEntry = new AddEntry({
  p2wdb: adapters.p2wdb,
  localdb: adapters.localdb
})
const readEntry = new ReadEntry({ p2wdb: adapters.p2wdb })

// Start all the non-REST controllers for the P2WDB. This includes IPFS,
// ipfs-coord, JSON RPC over IPFS, and OrbitDB with the custom access controller.
async function startP2wdb () {
  try {
    // Start the P2WDB.
    await adapters.p2wdb.start()

    // Trigger the addPeerEntry() use-case after a replication-validation event.
    adapters.p2wdb.orbit.validationEvent.on(
      'ValidationSucceeded',
      async function (data) {
        try {
          // console.log(
          //   'ValidationSucceeded event triggering addPeerEntry() with this data: ',
          //   data
          // )

          await addEntry.addPeerEntry(data)
        } catch (err) {
          console.error(
            'Error trying to process peer data with addPeerEntry(): ',
            err
          )
          // Do not throw an error. This is a top-level function.
        }
      }
    )
  } catch (err) {
    console.error('Error in controllers/index.js/startP2wdb()')
    throw err
  }
}
startP2wdb()

// Export the instances of the use-cases.
module.exports = {
  addEntry,
  readEntry
}
