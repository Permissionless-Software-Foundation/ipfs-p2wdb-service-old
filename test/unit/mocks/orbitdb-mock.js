/*
  A mocked version of the OrbitDB library.
*/

class OrbitDBMock {
  constructor () {
    this.all = {}
    this.id = 'id'
  }

  async put () {
    return 'hash'
  }

  async load () {
    return 'load'
  }
}

module.exports = OrbitDBMock
