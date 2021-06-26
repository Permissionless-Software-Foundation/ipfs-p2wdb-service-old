/*
  Mocks for the ipfs-coord library
*/

class IPFSCoord {
  async isReady () {
    return true
  }
}

module.exports = IPFSCoord
