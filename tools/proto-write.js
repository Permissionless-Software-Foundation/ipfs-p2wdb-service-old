/*
  Adapted from burn-and-write.js. Instead of creating a new transaction, this
  script will re-use an existing transaction that is hard-coded.
*/

const axios = require('axios')

const bodyData = {
  txid: '0fc58bdd91ff92cb47387d950a505d934b3776a1b2544ea9b53102d4697ef91f',
  signature:
    'IA8LCUnN6TUocSGnCe9nA1T4D+9hurJJ0vi3vBEJvAVwFfGcZ9ZlIWdR1m30wAxO4r0wb3YSzrM3QynpfgKUW/w=',
  message: 'test',
  data:
    '{"appId":"test","title":"7170","sourceUrl":"63156","ipfsUrl":"73680","timestamp":"2021-06-23T00:26:51.789Z","localTimestamp":"6/22/2021, 5:26:51 PM"}'
}

const SERVER = 'http://localhost:5001/temp/write'
// const SERVER = 'http://192.168.0.76:5001/p2wdb'
// const SERVER = 'https://p2wdb.fullstackcash.nl/p2wdb'

async function burnAndWrite () {
  try {
    // Submit the txid as proof-of-burn to write data to the database.
    const result = await axios.post(SERVER, bodyData)
    console.log(`Response from API: ${JSON.stringify(result.data, null, 2)}`)
  } catch (err) {
    console.error('Error in burnTokens: ', err)
    console.log(`Error message: ${err.message}`)
  }
}
burnAndWrite()
