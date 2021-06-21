/*
  Clean Architecture Controller for the POST Entry.
*/

class PostEntry {
  constructor (localConfig) {
    this.addEntry = localConfig.addEntry

    if (!this.addEntry) throw new Error('add-entry use case required.')
  }

  addEntry (ctx) {
    try {
      const body = ctx.request.body
      console.log('body: ', body)

      ctx.body = {
        success: true
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = PostEntry
