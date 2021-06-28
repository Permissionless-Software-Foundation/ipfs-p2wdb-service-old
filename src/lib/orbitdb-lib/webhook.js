/*
  This library controlls webhooks.
*/

class Webhooks {
  // constructor (localConfig) {}

  // Called whenever a new entry to the OrbitDB is validated. Runs the new
  // entry through the webhook filters to see if there is a match.
  // If there is an error, this function exits quietly, so as not to disturb
  // the parent function calling it.
  async triggerHooks (inputObj) {
    try {
      console.log(
        `triggerHooks called with this data: ${JSON.stringify(
          inputObj,
          null,
          2
        )}`
      )
      // const { txid, signature, message, data, hash } = inputObj
      const { data } = inputObj

      let parsedData
      try {
        // Parse the JSON in the data.
        parsedData = JSON.parse(data)

        // Throw an error if there is no 'appId' property.
        if (!parsedData.appId) throw new Error('No appID property')
      } catch (err) {
        console.log(
          'New data does not contain an appId property. Not triggering webhook'
        )
      }
      console.log(`parsedData: ${JSON.stringify(parsedData, null, 2)}`)
    } catch (err) {
      console.error('Error in triggerHooks(): ', err)
      // Do not throw an error
    }
  }
}

module.exports = Webhooks
