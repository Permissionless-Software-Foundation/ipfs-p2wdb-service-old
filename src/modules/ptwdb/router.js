const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

// ptwdb = pay to write DB
module.exports.baseUrl = '/p2wdb'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [controller.writeToDb]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [controller.readAll]
  },
  {
    method: 'GET',
    route: '/:hash',
    handlers: [controller.readEntry]
  }
  // {
  //   method: 'PUT',
  //   route: '/:id',
  //   handlers: [
  //     validator.ensureTargetUserOrAdmin,
  //     controller.getUser,
  //     controller.updateUser
  //   ]
  // },
  // {
  //   method: 'DELETE',
  //   route: '/:id',
  //   handlers: [
  //     validator.ensureTargetUserOrAdmin,
  //     controller.getUser,
  //     controller.deleteUser
  //   ]
  // }
]
