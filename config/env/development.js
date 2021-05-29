/*
  These are the environment settings for the DEVELOPMENT environment.
  This is the environment run by default with `npm start` if P2W_ENV is not
  specified.
*/

module.exports = {
  session: 'secret-boilerplate-token',
  token: 'secret-jwt-token',
  database: 'mongodb://localhost:27017/ipfs-service-dev',
  env: 'dev'
}
