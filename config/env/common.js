/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

/* eslint  no-unneeded-ternary:0 */

module.exports = {
  // Configure TCP port.
  port: process.env.PORT || 5001,

  // Password for HTML UI that displays logs.
  logPass: 'test',

  // Email server settings if nodemailer email notifications are used.
  emailServer: process.env.EMAILSERVER
    ? process.env.EMAILSERVER
    : 'mail.someserver.com',
  emailUser: process.env.EMAILUSER
    ? process.env.EMAILUSER
    : 'noreply@someserver.com',
  emailPassword: process.env.EMAILPASS
    ? process.env.EMAILPASS
    : 'emailpassword',

  // IPFS settings.
  isCircuitRelay: process.env.ENABLE_CIRCUIT_RELAY ? true : false,

  // Information passed to other IPFS peers about this node.
  apiInfo: 'https://p2wdb.fullstack.cash/',

  // P2W DB OrbitDB name.
  orbitDbName: process.env.ORBITDB_NAME
    ? process.env.ORBITDB_NAME
    : 'testdb008',

  // Maximum size of a new database entry.
  maxMessageSize: process.env.MAX_MESSAGE_SIZE
    ? parseInt(process.env.MAX_MESSAGE_SIZE)
    : 10000,

  // SLP Token to use for this database.
  tokenId: process.env.TOKEN_ID
    ? process.env.TOKEN_ID
    : '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',

  // Quantity of tokens required to burn in order to write to DB.
  reqTokenQty: process.env.REQ_TOKEN_QTY
    ? parseInt(process.env.REQ_TOKEN_QTY)
    : 0.01,

  // JSON-LD and Schema.org schema with info about this app.
  announceJsonLd: {
    '@context': 'https://schema.org/',
    '@type': 'WebAPI',
    name: 'ipfs-p2wdb-service',
    description: 'This is an access point to the PSF pay-to-write database.',
    documentation: 'https://p2wdb.fullstack.cash/',
    provider: {
      '@type': 'Organization',
      name: 'Permissionless Software Foundation',
      url: 'https://PSFoundation.cash'
    }
  },

  // IPFS Ports
  ipfsTcpPort: 5668,
  ipfsWsPort: 5669
}
