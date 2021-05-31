/*
  A mocked version of the OrbitDB library.
*/

class OrbitDBMock {
  constructor () {
    this.all = {}
  }

  async put () {
    return 'hash'
  }
}

module.exports = OrbitDBMock
