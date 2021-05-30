/*
  e2e tests for the P2WDB REST API endpoints.
*/

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
          url: `${LOCALHOST}/ptwdb`,
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
          url: `${LOCALHOST}/ptwdb`,
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
          url: `${LOCALHOST}/ptwdb`,
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

    it('should return error if signature is invalid', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/ptwdb`,
          data: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
            message: 'A message'
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

    it('should return true if can append into the db', async () => {
      const txid =
        '038b63aa3b1fc8d6ca6043ce577410e8d0bdd9189a3f07d4e0d8f32274e1ddc0'

      // Ensure entry is not in the database.
      try {
        await deleteKey(txid)
      } catch (err) {}

      const options = {
        method: 'POST',
        url: `${LOCALHOST}/ptwdb`,
        data: {
          txid,
          signature:
            'H+KlUnu+Eg6599g0S+pb1VHCLb6+ga9K05U+3T5dSu0qAR0I6DeoUe8LRyO+td4f5OhBIK8iFFcDoRsmEt/VfLw=',
          message: 'test'
        }
      }

      // Add entry to the database.
      const result = await axios(options)
      // console.log('result: ', result)

      assert.equal(result.data.success, true)
    })

    it('should throw error if entry already in db', async () => {
      try {
        const txid =
          '038b63aa3b1fc8d6ca6043ce577410e8d0bdd9189a3f07d4e0d8f32274e1ddc0'

        const options = {
          method: 'POST',
          url: `${LOCALHOST}/ptwdb`,
          data: {
            txid,
            signature:
              'H+KlUnu+Eg6599g0S+pb1VHCLb6+ga9K05U+3T5dSu0qAR0I6DeoUe8LRyO+td4f5OhBIK8iFFcDoRsmEt/VfLw=',
            message: 'test'
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
  })
})
