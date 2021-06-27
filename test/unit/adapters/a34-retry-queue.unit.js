/*
  Unit tests for the retry-queue library.
*/

const sinon = require('sinon')
const assert = require('chai').assert
// const BCHJS = require('@psf/bchjs')

// const RetryQueue = require('../../../src/adapters/orbit/retry-queue')

// const bchjs = new BCHJS()
// let uut
let sandbox

describe('#retry-queue.js', () => {
  beforeEach(() => {
    // uut = new RetryQueue({ bchjs })

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if instance of bchjs is not provided', () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#_retryWrapper', () => {
    it('should execute the given function.', () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should call handleValidationError() when error is thrown', () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should retry 5 times before giving up', () => {
      // TODO
      assert.equal(1, 1)
    })
  })

  describe('#addToQueue', () => {
    it('should add a function and input object to the queue and execute them', async () => {
      // TODO
      assert.equal(1, 1)
    })

    it('should catch and throw an error', async () => {
      // TODO
      assert.equal(1, 1)
    })
  })
})
