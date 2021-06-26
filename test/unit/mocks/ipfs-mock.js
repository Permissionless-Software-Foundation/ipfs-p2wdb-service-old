/*
  Mocks for the js-ipfs
*/

class IPFS {
  static create () {
    const mockIpfs = new MockIpfsInstance()

    return mockIpfs
  }
}

class MockIpfsInstance {
  constructor () {
    this.config = {
      profiles: {
        apply: () => {}
      }
    }
  }
}

module.exports = IPFS
