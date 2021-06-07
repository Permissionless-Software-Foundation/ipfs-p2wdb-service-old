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
   * curl -H "Content-Type: application/json" -X POST -d '{ "txid": "038b63aa3b1fc8d6ca6043ce577410e8d0bdd9189a3f07d4e0d8f32274e1ddc0", "message": "test", "signature": "H+KlUnu+Eg6599g0S+pb1VHCLb6+ga9K05U+3T5dSu0qAR0I6DeoUe8LRyO+td4f5OhBIK8iFFcDoRsmEt/VfLw=" }' localhost:5001/p2wdb
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
