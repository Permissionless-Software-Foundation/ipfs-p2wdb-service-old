/*
  Mocks for the use cases.
*/

const ReadEntryMock = require('./read-entry.mock')

class UseCasesMock {
  constructor () {
    this.entry = {
      readEntry: new ReadEntryMock(),
      addEntry: () => {}
    }

    this.webhook = {
      addWebhook: {
        addNewWebhook: async () => {}
      },
      remove: async () => {}
    }
  }
}

module.exports = UseCasesMock
