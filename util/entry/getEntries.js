const mongoose = require('mongoose')

const config = require('../../config')

const KeyValue = require('../../src/models/key-value')

async function getUsers () {
  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const entries = await KeyValue.find({})
  console.log(`entries: ${JSON.stringify(entries, null, 2)}`)

  mongoose.connection.close()
}
getUsers()
