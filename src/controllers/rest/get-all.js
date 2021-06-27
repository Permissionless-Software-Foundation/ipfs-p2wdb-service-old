/*
  Clean Architecture Controller for the GET all Entries.
*/

class GetAllEntries {
  constructor (localConfig = {}) {
    this.getEntries = localConfig.getEntries

    if (!this.getEntries) throw new Error('get-entries use case required.')
  }

  /**
   * @api {get} /p2wdb Read All
   * @apiPermission public
   * @apiName P2WDB Read All
   * @apiGroup REST P2WDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/temp/all
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
  async restController (ctx) {
    try {
      console.log('this.getEntries: ', this.getEntries)

      // Get all the contents of the P2WDB.
      const allData = await this.getEntries.readAllEntries()

      ctx.body = {
        success: true,
        data: allData
      }
    } catch (err) {
      console.log('Error in get-all.js/restController(): ', err)
      throw err
    }
  }
}

module.exports = GetAllEntries
