/*
  A mocked version of the OrbitDB library.
*/

class OrbitDBMock {
  all () {
    return {}
  }

  async put () {
    return 'hash'
  }
}

module.exports = OrbitDBMock
