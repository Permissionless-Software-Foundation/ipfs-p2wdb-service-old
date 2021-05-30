/*
  This is the JSON RPC router for the P2WDB API.
*/

// Public npm libraries
// const jsonrpc = require('jsonrpc-lite')

// Local libraries
const wlogger = require('../../lib/wlogger')
// const UserLib = require('../../lib/users')
// const RateLimit = require('../rate-limit')

class P2wdbRPC {
  async p2wdbRouter (rpcData, p2wdb) {
    let endpoint = 'unknown'

    try {
      // console.log('authRouter rpcData: ', rpcData)

      endpoint = rpcData.payload.params.endpoint

      // Route the call based on the requested endpoint.
      switch (endpoint) {
        case 'readAll':
          // await this.rateLimit.limiter(rpcData.from)
          return await this.readAll(rpcData, p2wdb)
      }
    } catch (err) {
      console.error('Error in P2wdbRPC/p2wdbRouter()')
      // throw err

      return {
        success: false,
        status: 500,
        message: err.message,
        endpoint
      }
    }
  }

  // Read all entries from the P2WDB.
  // {"jsonrpc":"2.0","id":"555","method":"p2wdb","params":{"endpoint": "readAll"}}
  async readAll (rpcData, p2wdb) {
    try {
      // Get all the contents of the P2WDB.
      const allData = p2wdb.readAll()

      const response = {
        endpoint: 'readAll',
        status: 200,
        success: true,
        message: '',
        data: allData
      }

      return response
    } catch (err) {
      // console.error('Error in authUser()')
      wlogger.error('Error in p2wdb/readAll(): ', err)
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'readAll'
      }
    }
  }
}

module.exports = P2wdbRPC
