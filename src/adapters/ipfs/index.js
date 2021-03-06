/*
  top-level IPFS library that combines the individual IPFS-based libraries.
*/

const IpfsAdapter = require('./ipfs')
const IpfsCoordAdapter = require('./ipfs-coord')

class IPFS {
  constructor (localConfig) {
    // Encapsulate dependencies
    this.ipfsAdapter = new IpfsAdapter()

    // Properties of this class instance.
    this.isReady = false
  }

  // Provides a global start() function that triggers the start() function in
  // the underlying libraries.
  async start () {
    try {
      // Start IPFS
      await this.ipfsAdapter.start()
      console.log('IPFS is ready.')

      // this.ipfs is a Promise that will resolve into an instance of an IPFS node.
      this.ipfs = this.ipfsAdapter.ipfs

      // Start ipfs-coord
      this.ipfsCoordAdapter = new IpfsCoordAdapter({
        ipfs: this.ipfs
      })
      await this.ipfsCoordAdapter.start()
      console.log('ipfs-coord is ready.')
    } catch (err) {
      console.error('Error in adapters/ipfs/index.js/start()')
      throw err
    }
  }
}

module.exports = IPFS
