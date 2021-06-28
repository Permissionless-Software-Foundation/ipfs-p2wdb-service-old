/*
  This support library handles the connection to the IPFS network. It instantiates
  the IPFS node and starts the ipfs-coord library. It also initiates the router
  for handling JSON RPC commands recieved over IPFS pubsub channels through ipfs-coord.
*/

// Global npm libraries
const IPFS = require('ipfs')
const IpfsCoord = require('ipfs-coord')
// const IpfsCoord = require('../../../ipfs-coord')
const BCHJS = require('@psf/bch-js')

// Local libraries
const config = require('../../config')
const JSONRPC = require('../rpc')
const wlogger = require('./wlogger')
const PayToWriteDB = require('./orbitdb-lib/pay-to-write')

class IPFSLib {
  constructor (localConfig) {
    // Encapsulate dependencies
    this.IPFS = IPFS
    this.IpfsCoord = IpfsCoord
    this.bchjs = new BCHJS()
    this.rpc = new JSONRPC()
    this.config = config

    // Pointers to instances of ipfs and P2WDB orbitdb.
    // These empty objects will be replaced after startup completes.
    this.ipfs = {}
    this.p2wdb = {}

    // Properties of this class instance.
    this.isReady = false

    // this.rpc = {}
    // if (localConfig.rpc) {
    //   this.rpc = localConfig.rpc
    // }
  }

  // This is a 'macro' start method. It kicks off several smaller methods that
  // start the various subcomponents of this IPFS library.
  async start () {
    try {
      await this.startIpfs()
      await this.startIpfsCoord()
      await this.startP2wdb()

      // Update the RPC instance with the instance of ipfs-coord.
      this.rpc.ipfsCoord = this.ipfsCoord
      this.rpc.p2wdb = this.p2wdb

      this.isReady = true

      console.log('IPFS is ready.')
    } catch (err) {
      console.error('Error trying to start IPFS: ', err)

      // Added the exit() call because this app has been observed crashing due
      // to out-of-memory errors. IPFS is a memory hog. It then can't automatically
      // restart due to an IPFS lock-file error. Exiting the app will give a
      // process management like pm2 or systemd to successfully restart the app.
      console.log('Shutting down app. Hopefully pm2 can restart it!')
      process.exit(1)
    }
  }

  async startIpfs () {
    try {
      // Ipfs Options
      const ipfsOptions = {
        repo: './ipfsdata',
        start: true,
        config: {
          relay: {
            enabled: true, // enable circuit relay dialer and listener
            hop: {
              enabled: true // enable circuit relay HOP (make this node a relay)
            }
          },
          pubsub: true, // enable pubsub
          Swarm: {
            ConnMgr: {
              HighWater: 30,
              LowWater: 10
            }
          },
          Addresses: {
            Swarm: [
              `/ip4/0.0.0.0/tcp/${this.config.ipfsTcpPort}`,
              `/ip4/0.0.0.0/tcp/${this.config.ipfsWsPort}/ws`
            ]
          }
        }
      }

      // Create a new IPFS node.
      this.ipfs = await this.IPFS.create(ipfsOptions)

      // Set the 'server' profile so the node does not scan private networks.
      await this.ipfs.config.profiles.apply('server')

      // const nodeConfig = await this.ipfs.config.getAll()
      // console.log(
      //   `IPFS node configuration: ${JSON.stringify(nodeConfig, null, 2)}`
      // )
    } catch (err) {
      console.error('Error in startIpfs()')
      throw err
    }
  }

  async startIpfsCoord () {
    try {
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

      await this.ipfsCoord.isReady()
    } catch (err) {
      console.error('Error in startIpfsCoord()')
      throw err
    }
  }

  async startP2wdb () {
    try {
      const _config = {
        ipfs: this.ipfs
      }

      // Create an instance of the P2W DB.
      this.p2wdb = new PayToWriteDB(_config)

      // Wait for OrbitDB to start.
      await this.p2wdb.createDb(this.config.orbitDbName)

      // OrbitDB is directly accessible through this.p2wdb.db
    } catch (err) {
      wlogger.error('Error in ipfs.js/startP2wdb()')
      throw err
    }
  }
}

module.exports = IPFSLib
