/*
  Clean Architecture Controller for the POST Entry.
*/

// const UseCases = require()

class PostEntry {
  constructor (localConfig = {}) {
    this.addEntry = localConfig.addEntry

    if (!this.addEntry) throw new Error('add-entry use case required.')
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
  async restController (ctx) {
    try {
      const txid = ctx.request.body.txid
      const signature = ctx.request.body.signature
      const message = ctx.request.body.message
      const data = ctx.request.body.data

      const writeObj = { txid, signature, message, data }
      console.log(`body data: ${JSON.stringify(writeObj, null, 2)}`)

      const hash = await this.addEntry.addUserEntry(writeObj)

      ctx.body = {
        success: true,
        hash
      }
    } catch (err) {
      console.log('Error in post-entry.js/restController(): ', err)
      throw err
    }
  }
}

module.exports = PostEntry
