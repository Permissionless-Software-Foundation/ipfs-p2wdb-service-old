/*
  Clean Architecture Controller for the POST Entry.
*/

class PostEntry {
  constructor (localConfig) {
    this.addEntry = localConfig.addEntry

    if (!this.addEntry) throw new Error('add-entry use case required.')
  }

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
