const KeyValue = require('../../models/key-value')

const config = require('../../../config')

class PTWDBController {
  constructor () {
    // _this = this

    // Encapsulate dependencies
    this.KeyValue = KeyValue
    this.config = config
    this.ipfs = {}
    this.ptwDb = {}
  }

  /**
   * @api {post} /p2wdb Write
   * @apiPermission public
   * @apiName P2WDB Write
   * @apiGroup REST P2WDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "txid": "9ac06c53c158430ea32a587fb4e2bc9e947b1d8c6ff1e4cc02afa40d522d7967", "message": "test", "signature": "H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=", "data": "This is the data that will go into the database." }' localhost:5001/p2wdb
   *
   * @apiDescription
   * Write a new entry to the database.
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async writeToDb (ctx) {
    try {
      const key = ctx.request.body.txid
      const signature = ctx.request.body.signature
      const message = ctx.request.body.message
      const data = ctx.request.body.data

      const writeObj = { key, signature, message, data }
      console.log(`writeObj: ${JSON.stringify(writeObj, null, 2)}`)

      const success = await ctx.ipfsLib.p2wdb.write(writeObj)

      ctx.body = {
        success
      }
    } catch (err) {
      console.error(err)
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {post} /p2wdb Read All
   * @apiPermission public
   * @apiName P2WDB Read All
   * @apiGroup REST P2WDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/p2wdb
   *
   * @apiDescription
   * Read all the entries from the database.
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  readAll (ctx) {
    try {
      // TODO: Replace this code with a call to pay-to-write.js/readAll()

      // Get all the contents of the P2WDB.
      const allData = ctx.ipfsLib.p2wdb.readAll()

      ctx.body = {
        success: true,
        data: allData
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = PTWDBController
