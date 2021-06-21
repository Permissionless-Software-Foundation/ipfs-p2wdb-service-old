/*
  This index file for the Clean Architecture Controllers loads dependencies,
  creates instances, and attaches the controller to REST API endpoints for
  Koa.
*/

const Router = require('koa-router')

module.exports = function attachControllers (app) {
  const baseUrl = '/temp'
  const router = new Router({ prefix: baseUrl })

  // curl -H "Content-Type: application/json" -X GET localhost:5001/temp/
  router.get('/', (ctx, next) => {
    const now = new Date()
    ctx.body = now.toLocaleString()
  })

  app.use(router.routes()).use(router.allowedMethods())
}
