/*
  e2e tests for the P2WDB REST API endpoints.

  Note: These are old tests from the old REST API controller.
*/
/*
const axios = require('axios')
const assert = require('chai').assert
const config = require('../../../config')
// const sinon = require('sinon')

const LOCALHOST = `http://localhost:${config.port}`
const PTWLIB = require('../../../src/modules/ptwdb/controller')
// const mockContext = require('../../unit/mocks/ctx-mock').context
const KeyValue = require('../../../src/models/key-value')
// const context = {}

// Remove test key from the db
const deleteKey = async txid => {
  try {
    const keyValue = await KeyValue.find({ key: txid })
    await keyValue[0].remove()
  } catch (error) {
    console.log(error)
    throw error
  }
}

let uut
// let sandbox

describe('#Pay-To-Write', () => {
  beforeEach(async () => {
    uut = new PTWLIB()
    // define db mock , to allow sinon stub
    uut.db = {
      put: () => {}
    }

    // sandbox = sinon.createSandbox()
  })

  after(async () => {
    // await deleteKey()
  })

  describe('#writeToDb', () => {
    it('should throw error if txid is not provided', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/p2wdb`,
          data: {
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
            message: 'A message'
          }
        }

        const result = await axios(options)
        console.log('result.data: ', result.data)
        assert.fail('unexpected error')
      } catch (err) {
        assert.include(err.response.data, 'key must be a string')
      }
    })

    it('should throw error if signature is not provided', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/p2wdb`,
          data: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            message: 'A message'
          }
        }

        const result = await axios(options)
        console.log('result.data: ', result.data)
        assert.fail('unexpected error')
      } catch (err) {
        assert.include(err.response.data, 'signature must be a string')
      }
    })

    it('should throw error if message is not provided', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/p2wdb`,
          data: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='
          }
        }

        const result = await axios(options)
        console.log('result.data: ', result.data)
        assert.fail('unexpected error')
      } catch (err) {
        assert.include(err.response.data, 'message must be a string')
      }
    })

    it('should throw error if data is not provided', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/p2wdb`,
          data: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            message: 'A message',
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI='
          }
        }

        const result = await axios(options)
        console.log('result.data: ', result.data)
        assert.fail('unexpected error')
      } catch (err) {
        assert.include(err.response.data, 'data must be a string')
      }
    })

    it('should return error if signature is invalid', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/p2wdb`,
          data: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
            message: 'A message',
            data: 'test data'
          }
        }

        await axios(options)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        // console.log('err.message: ', err.message)

        assert.equal(err.response.status, 422)
        assert.include(err.response.data, 'not allowed to write to the log')
      }
    })

    it('should return success=true if can append into the db', async () => {
      const txid =
        '9ac06c53c158430ea32a587fb4e2bc9e947b1d8c6ff1e4cc02afa40d522d7967'

      // Ensure entry is not in the database.
      try {
        await deleteKey(txid)
      } catch (err) {}

      const options = {
        method: 'POST',
        url: `${LOCALHOST}/p2wdb`,
        data: {
          txid,
          signature:
            'H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=',
          message: 'test',
          data: 'test data'
        }
      }

      // Add entry to the database.
      let result = await axios(options)
      result = result.data
      console.log('result: ', result)

      // Function should return an object with the following properties.
      assert.property(result, 'hash')
      assert.property(result, 'success')
      assert.property(result, 'key')
      assert.property(result, 'value')

      // Function should return true if entry was successfully added to the
      // database.
      assert.equal(true, result.success)
    })

    it('should throw error if entry already in db', async () => {
      try {
        const txid =
          '9ac06c53c158430ea32a587fb4e2bc9e947b1d8c6ff1e4cc02afa40d522d7967'

        const options = {
          method: 'POST',
          url: `${LOCALHOST}/p2wdb`,
          data: {
            txid,
            signature:
              'H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=',
            message: 'test',
            data: 'test data'
          }
        }

        // Add entry to the database.
        await axios(options)
        // console.log('result: ', result)

        assert.fail('unexpected code path')
      } catch (err) {
        // console.log(err)
        // console.log('err.message: ', err.message)

        assert.equal(err.response.status, 422)
        assert.include(err.response.data, 'Entry already in database')
      }
    })

    // TODO
    it('should throw an error if database entry is too big', async () => {
      // Current threshold is 10KB. This test should try to pass data larger than
      // 10KB and assert that an error is returned.
      assert.equal(1, 1)
    })
  })

  // TODO
  describe('#readAll', () => {
    it('should implement tests', () => {
      assert.equal(1, 1)
    })
  })

  // TODO
  describe('#readEntry', () => {
    it('should implement tests', () => {
      assert.equal(1, 1)
    })
  })
})
*/
