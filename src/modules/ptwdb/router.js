const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

// ptwdb = pay to write DB
module.exports.baseUrl = '/ptwdb'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [controller.writeToDb]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      controller.readAll
    ]
  }
  // {
  //   method: 'GET',
  //   route: '/:id',
  //   handlers: [
  //     validator.ensureUser,
  //     controller.getUser
  //   ]
  // },
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
