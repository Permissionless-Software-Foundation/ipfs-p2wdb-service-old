/*
  This library leverages the p-retry and p-queue libraries, to created a
  validation queue with automatic retry.
  New nodes connecting will attempt to rapidly validate a lot of entries.
  A promise-based queue allows this to happen while respecting rate-limits
  of the blockchain service provider.
*/

const PQueue = require('p-queue').default
const pRetry = require('p-retry')

let _this

class RetryQueue {
  constructor (localConfig) {
    if (!localConfig.bchjs) {
      throw new Error(
        'Must pass instance of bch-js when instantiating RetryQueue Class.'
      )
    }
    this.bchjs = localConfig.bchjs

    // Encapsulate dependencies
    this.validationQueue = new PQueue({ concurrency: 1 })

    _this = this
  }

  // Add an async function to the queue, and execute it with the input object.
  async addToQueue (funcHandle, inputObj) {
    try {
      const returnVal = await _this.validationQueue.add(() =>
        _this.retryWrapper(funcHandle, inputObj)
      )

      return returnVal
    } catch (err) {
      console.error('Error in addToQueue()')
      throw err
    }
  }

  // Wrap the p-retry library.
  // This function returns a promise that will resolve to the output of the
  // function 'funcHandle'.
  async retryWrapper (funcHandle, inputObj) {
    try {
      console.log('Entering retryWrapper()')

      return pRetry(
        async () => {
          return await funcHandle(inputObj)
        },
        {
          onFailedAttempt: _this.handleValidationError,
          retries: 5 // Retry 5 times
        }
      )
    } catch (err) {
      console.error('Error in retryWrapper: ', err)
      // throw err?
    }
  }

  // Notifies the user that an error occured and that a retry will be attempted.
  // It tracks the number of retries until it fails.
  async handleValidationError (error) {
    try {
      const errorMsg = `Attempt ${error.attemptNumber} to validate entry. There are ${error.retriesLeft} retries left. Waiting before trying again.`
      console.log(errorMsg)

      const SLEEP_TIME = 30000
      console.log(`Waiting ${SLEEP_TIME} milliseconds before trying again.\n`)
      await _this.bchjs.Util.sleep(SLEEP_TIME) // 30 sec
    } catch (err) {
      console.error('Error in handleValidationError(): ', err)
      throw err
    }
  }
}

module.exports = RetryQueue
