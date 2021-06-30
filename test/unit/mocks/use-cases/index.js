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
  }
}

module.exports = UseCasesMock
