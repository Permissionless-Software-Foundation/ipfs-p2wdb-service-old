const axios = require('axios')
const assert = require('chai').assert
const config = require('../../../config')
const sinon = require('sinon')

const LOCALHOST = `http://localhost:${config.port}`
const PTWLIB = require('../../../src/modules/ptwdb/controller')
const mockContext = require('../../unit/mocks/ctx-mock').context
const KeyValue = require('../../../src/models/key-value')
const context = {}

// Remove test key from the db
const deleteKey = async () => {
  try {
    const keyValue = await KeyValue.find({ key: context.key })
    await keyValue[0].remove()
  } catch (error) {
    console.log(error)
    throw error
  }
}

let uut
let sandbox

describe('#Pay-To-Write', () => {
  beforeEach(async () => {
    uut = new PTWLIB()
    // define db mock , to allow sinon stub
    uut.db = {
      put: () => {}
    }
    sandbox = sinon.createSandbox()
  })

  after(async () => {
    await deleteKey()
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
        assert.include(err.response.data, 'txid must be a string')
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

    it('should return true if can append into the db', async () => {
      try {
        sandbox.stub(uut.db, 'put').resolves('hash')
        const ctx = mockContext()
        ctx.request = {
          body: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
            message: 'A message'
          }
        }
        await uut.writeToDb(ctx)
        assert.isTrue(ctx.body.success)
        context.key = ctx.request.body.txid
      } catch (err) {
        console.log(err)
        assert.fail('unexpected error')
      }
    })
    it('should throw error if entry already in db', async () => {
      try {
        sandbox.stub(uut.db, 'put').resolves('hash')
        const ctx = mockContext()
        ctx.request = {
          body: {
            txid:
              '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa',
            signature:
              'H+S7OTnqZzs34lAJW4DPvCkLIv4HlR1wBux7x2OxmeiCVJ8xDmo3jcHjtWc4N9mdBVB4VUSPRt9Ete9wVVDzDeI=',
            message: 'A message'
          }
        }
        await uut.writeToDb(ctx)
        assert.fail('unexpected error')
      } catch (err) {
        assert.include(err.message, 'Entry already in database')
      }
    })
  })
})
