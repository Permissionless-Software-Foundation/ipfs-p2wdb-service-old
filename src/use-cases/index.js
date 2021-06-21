const AddEntry = require('./add-entry')

const addEntry = new AddEntry({
  p2wdb: () => {},
  localdb: () => {}
})

module.exports = {
  addEntry
}
