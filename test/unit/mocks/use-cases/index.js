/*
  Mocks for the use cases.
*/

const ReadEntryMock = require('./read-entry.mock')

class UseCasesMock {
  constructor () {
    this.readEntry = new ReadEntryMock()
    this.addEntry = () => {}
  }
}

module.exports = UseCasesMock
