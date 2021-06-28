/*
  This is the JSON RPC router for the P2WDB API.

  TODO:
   - Unit and integration tests needed.
*/

// Public npm libraries
// const jsonrpc = require('jsonrpc-lite')

// Local libraries
const wlogger = require('../../../lib/wlogger')
const useCases = require('../../../use-cases')
console.log('useCases: ', useCases)

class P2wdbRPC {
  async p2wdbRouter (rpcData, p2wdb) {
    let endpoint = 'unknown' // Default value.

    try {
      // console.log('authRouter rpcData: ', rpcData)

      endpoint = rpcData.payload.params.endpoint

      // Route the call based on the requested endpoint.
      switch (endpoint) {
        case 'readAll':
          // await this.rateLimit.limiter(rpcData.from)
          return await this.readAll(rpcData, p2wdb)

        case 'write':
          return await this.write(rpcData, p2wdb)
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

  /**
   * @api {JSON} /p2wdb Read All
   * @apiPermission public
   * @apiName P2WDB Read All
   * @apiGroup JSON P2WDB
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"p2wdb","params":{"endpoint": "readAll"}}
   *
   * @apiDescription
   * Read all entries in the database.
   */
  // Read all entries from the P2WDB.
  // {"jsonrpc":"2.0","id":"555","method":"p2wdb","params":{"endpoint": "readAll"}}
  async readAll (rpcData, p2wdb) {
    try {
      console.log('P2WDB readAll() RPC endpoint called.')
      console.log('useCases: ', useCases)

      // Get all the contents of the P2WDB.
      const allData = await useCases.readEntry.readAllEntries()
      // const allData = p2wdb.readAll()

      const response = {
        endpoint: 'readAll',
        status: 200,
        success: true,
        message: '',
        data: allData
      }

      wlogger.debug(`Returning response: ${JSON.stringify(response, null, 2)}`)

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

  /**
   * @api {JSON} /p2wdb Write
   * @apiPermission public
   * @apiName P2WDB Write
   * @apiGroup JSON P2WDB
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"p2wdb","params":{"endpoint": "write", "txid": "9ac06c53c158430ea32a587fb4e2bc9e947b1d8c6ff1e4cc02afa40d522d7967", "message": "test", "signature": "H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=", "data": "This is the data that will go into the database."}}
   *
   * @apiDescription
   * Write a new entry to the database.
   */
  // (attempt to) write an entry to the P2WDB.
  // {"jsonrpc":"2.0","id":"555","method":"p2wdb","params":{"endpoint": "write", "txid": "23a104c012c912c351e61a451c387e511f65d115fa79bb5038f4e6bac811754a", "message": "test", "signature": "ID1G37GgWc2MugZHzNss53mMQPT0Mebix6erYC/Qlc+PaJqZaMfjK59KXPDF5wJWlHjcK8hpVbly/5SBAspR54o="}}
  async write (rpcData, p2wdb) {
    try {
      console.log('P2WDB write() RPC endpoint called.')

      const txid = rpcData.payload.params.txid
      const signature = rpcData.payload.params.signature
      const message = rpcData.payload.params.message
      const data = rpcData.payload.params.data

      const writeObj = { txid, signature, message, data }
      console.log(`writeObj: ${JSON.stringify(writeObj, null, 2)}`)

      const hash = await useCases.addEntry.addUserEntry(writeObj)

      // const result = await p2wdb.write(writeObj)

      const response = {
        endpoint: 'write',
        status: 200,
        success: true,
        message: '',
        data: hash
      }

      wlogger.debug(`Returning response: ${JSON.stringify(response, null, 2)}`)

      return response
    } catch (err) {
      // console.error('Error in authUser()')
      wlogger.error('Error in p2wdb/write(): ', err)
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'write'
      }
    }
  }
}

module.exports = P2wdbRPC
