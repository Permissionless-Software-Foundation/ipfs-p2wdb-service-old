/*
  This library file aggregates all the Adapters.
*/

// Individual adapter libraries.
const P2WDB = require('../adapters/p2wdb')
const LocalDB = require('../adapters/local-db')

class Adapters {
  constructor () {
    this.p2wdb = new P2WDB()
    this.localdb = new LocalDB()
  }

  // This method is called at startup to start the P2WDB and it's dependent
  // adapters, like IPFS, ipfs-coord, and OrbitDB. It also attaches an
  // event handler to the add-entry use case.
  // async startP2wdb() {
  //   try {
  //     // Start the P2WDB.
  //     await this.p2wdb.start()
  //
  //     // Trigger the addPeerEntry() use-case after a replication-validation event.
  //     this.p2wdb.orbit.validationEvent.on(
  //       'ValidationSucceeded',
  //       async function (data) {
  //         try {
  //           // console.log(
  //           //   'ValidationSucceeded event triggering addPeerEntry() with this data: ',
  //           //   data
  //           // )
  //
  //           await addEntry.addPeerEntry(data)
  //         } catch (err) {
  //           console.error(
  //             'Error trying to process peer data with addPeerEntry(): ',
  //             err
  //           )
  //           // Do not throw an error. This is a top-level function.
  //         }
  //       }
  //     )
  //   } catch (err) {
  //     console.error('Error in controllers/index.js/startP2wdb()')
  //     throw err
  //   }
  // }
}

module.exports = Adapters
