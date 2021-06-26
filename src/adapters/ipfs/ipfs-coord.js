/*
  Clean Architecture Adapter for ipfs-coord.
  This library deals with ipfs-coord library so that the apps business logic
  doesn't need to have any specific knowledge of the library.
*/

// Global npm libraries
const IpfsCoord = require('ipfs-coord')
const BCHJS = require('@psf/bch-js')

// Local libraries
const config = require('../../../config')
const JSONRPC = require('../../rpc')

class IpfsCoordAdapter {
  constructor (localConfig = {}) {
    // Dependency injection.
    this.ipfs = localConfig.ipfs
    if (!this.ipfs) {
      throw new Error(
        'Instance of IPFS must be passed when instantiating ipfs-coord.'
      )
    }

    // Encapsulate dependencies
    this.IpfsCoord = IpfsCoord
    this.bchjs = new BCHJS()
    this.rpc = new JSONRPC()
    this.config = config

    // Properties of this class instance.
    this.isReady = false
  }

  async start () {
    this.ipfsCoord = new this.IpfsCoord({
      ipfs: this.ipfs,
      type: 'node.js',
      // type: 'browser',
      bchjs: this.bchjs,
      privateLog: this.rpc.router,
      isCircuitRelay: this.config.isCircuitRelay,
      apiInfo: this.config.apiInfo,
      announceJsonLd: this.config.announceJsonLd
    })

    // Wait for the ipfs-coord library to signal that it is ready.
    await this.ipfsCoord.isReady()

    // Signal that this adapter is ready.
    this.isReady = true

    return this.isReady
  }
}

module.exports = IpfsCoordAdapter
