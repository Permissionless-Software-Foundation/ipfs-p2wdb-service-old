/*
  Creates an Orbit-DB Access Controller that allows anyone to write, so long
  as they can prove they have burned an SLP token.
*/

// Public npm libraries
const AccessController = require('orbit-db-access-controllers/src/access-controller-interface')
const pMapSeries = require('p-map-series')
const BCHJS = require('@psf/bch-js')

// Local libraries
const ensureAddress = require('./ensure-ac-address')
const KeyValue = require('../../models/key-value')

const TOKENID =
  // 'dd2fc6e47bfef7c9cfef39bd1be86b3a263a1822736a0c7a0655a758c6ea1713'
  'c2586d6a726ad3953dbac0c1e2a9c6342a78eb23e7e5f086f1b6aa4d760491d4'

let _this

class PayToWriteAccessController extends AccessController {
  constructor (orbitdb, options) {
    super()
    this._orbitdb = orbitdb
    this._db = null
    this._options = options || {}

    // Encapsulate dependencies
    this.bchjs = new BCHJS()
    this.KeyValue = KeyValue

    _this = this
  }

  /* Factory */
  static async create (orbitdb, options = {}) {
    const ac = new PayToWriteAccessController(orbitdb, options)

    // console.log('orbitdb: ', orbitdb)
    console.log('create options: ', options)

    await ac.load(
      options.address || options.name || 'default-access-controller'
    )

    // Add write access from options
    if (options.write && !options.address) {
      await pMapSeries(options.write, async e => ac.grant('write', e))
    }

    return ac
  }

  async load (address) {
    if (this._db) {
      await this._db.close()
    }

    // Force '<address>/_access' naming for the database
    this._db = await this._orbitdb.keyvalue(ensureAddress(address), {
      // use ipfs controller as a immutable "root controller"
      accessController: {
        type: 'ipfs',
        write: this._options.admin || [this._orbitdb.identity.id]
      },
      sync: true
    })

    this._db.events.on('ready', this._onUpdate.bind(this))
    this._db.events.on('write', this._onUpdate.bind(this))
    this._db.events.on('replicated', this._onUpdate.bind(this))

    await this._db.load()
  }

  // Returns the type of the access controller
  static get type () {
    return 'payToWrite'
  }

  // Returns the address of the OrbitDB used as the AC
  get address () {
    return this._db.address
  }

  // Return true if entry is allowed to be added to the database
  async canAppend (entry, identityProvider) {
    try {
      console.log('canAppend entry: ', entry)

      let validTx = false

      const txid = entry.payload.key
      const message = entry.payload.value.message
      const signature = entry.payload.value.signature

      // Fast validation: validate the TXID if it already exists in MongoDB.
      const mongoRes = await this.KeyValue.find({ key: txid })
      if (mongoRes.length > 0) {
        console.log('mongoRes: ', mongoRes)
        const mongoKey = mongoRes[0].key

        if (mongoKey === txid) {
          // Entry is already in the database.
          return true
        }
      }

      // Validate the signature to ensure the user submitting data owns
      // the address that did the token burn.
      // This prevents 'front running' corner case.
      const validSignature = await _this._validateSignature(
        txid,
        signature,
        message
      )
      console.log('Is valid signature: ', validSignature)
      if (!validSignature) {
        console.log(`Signature for TXID ${txid} is not valid. Rejecting entry.`)
        return false
      }

      // Validate the transaction matches the burning rules.
      validTx = await this._validateTx(txid)

      return validTx
    } catch (err) {
      console.log(
        'Error in pay-to-write-access-controller.js/canAppend(). Returning false. Error: \n',
        err
      )
      return false
    }
  }

  // Returns true if the txid burned at least 0.001 tokens.
  async _validateTx (txid) {
    try {
      let isValid = false

      const txInfo = await _this.bchjs.Transaction.get(txid)
      console.log(`txInfo: ${JSON.stringify(txInfo, null, 2)}`)

      // Return false if txid is not a valid SLP tx.
      if (!txInfo.isValidSLPTx) return false

      // Return false if tokenId does not match.
      if (txInfo.tokenId !== TOKENID) return false

      // Sum up all the token inputs
      let inputTokenQty = 0
      for (let i = 0; i < txInfo.vin.length; i++) {
        let tokenQty = 0

        if (!txInfo.vin[i].tokenQty) {
          tokenQty = 0
        } else {
          tokenQty = Number(txInfo.vin[i].tokenQty)
        }

        inputTokenQty += tokenQty
      }
      console.log(`inputTokenQty: ${inputTokenQty}`)

      // Sum up all the token outputs
      let outputTokenQty = 0
      for (let i = 0; i < txInfo.vout.length; i++) {
        let tokenQty = 0

        if (!txInfo.vout[i].tokenQty) {
          tokenQty = 0
        } else {
          tokenQty = Number(txInfo.vout[i].tokenQty)
        }

        outputTokenQty += tokenQty
      }
      console.log(`outputTokenQty: ${outputTokenQty}`)

      const diff = inputTokenQty - outputTokenQty
      console.log(`difference: ${diff}`)

      // If the difference is above a positive threshold, then it's a burn
      // transaction.
      if (diff > 0.001) {
        console.log(
          `TX ${txid} proved burn of tokens. Will be allowed to write to DB.`
        )
        isValid = true
      }

      return isValid
    } catch (err) {
      console.error('Error in _valideTx: ', err)
      return false
    }
  }

  get capabilities () {
    if (this._db) {
      const capabilities = this._db.index

      const toSet = e => {
        const key = e[0]
        capabilities[key] = new Set([...(capabilities[key] || []), ...e[1]])
      }

      // Merge with the access controller of the database
      // and make sure all values are Sets
      Object.entries({
        ...capabilities,
        // Add the root access controller's 'write' access list
        // as admins on this controller
        ...{
          admin: new Set([
            ...(capabilities.admin || []),
            ...this._db.access.write
          ])
        }
      }).forEach(toSet)

      return capabilities
    }
    return {}
  }

  get (capability) {
    return this.capabilities[capability] || new Set([])
  }

  async close () {
    await this._db.close()
  }

  async save () {
    // return the manifest data
    return {
      address: this._db.address.toString()
    }
  }

  async grant (capability, key) {
    console.log('grant capability: ', capability)
    console.log('grant key: ', key)

    // Merge current keys with the new key
    const capabilities = new Set([
      ...(this._db.get(capability) || []),
      ...[key]
    ])
    await this._db.put(capability, Array.from(capabilities.values()))
  }

  async revoke (capability, key) {
    const capabilities = new Set(this._db.get(capability) || [])
    capabilities.delete(key)
    if (capabilities.size > 0) {
      await this._db.put(capability, Array.from(capabilities.values()))
    } else {
      await this._db.del(capability)
    }
  }

  /* Private methods */
  _onUpdate () {
    this.emit('updated')
  }

  // Validate a signed messages, to ensure the signer of the message is the owner
  // of the second output of the TX. This ensures the same user who burned the
  // tokens is the same user submitting the new DB entry. It prevents
  // 'front running', or malicous users watching the network for valid burn
  // TXs then using them to submit their own data to the DB.
  async _validateSignature (txid, signature, message) {
    try {
      // Input validation
      if (!txid || typeof txid !== 'string') {
        throw new Error('txid must be a string')
      }
      if (!signature || typeof signature !== 'string') {
        throw new Error('signature must be a string')
      }
      if (!message || typeof message !== 'string') {
        throw new Error('message must be a string')
      }

      const tx = await _this.bchjs.RawTransactions.getRawTransaction(txid, true)

      // Get the address for the second output of the TX.
      const addresses = tx.vout[1].scriptPubKey.addresses
      const address = addresses[0]

      console.log(`address: ${address}`)
      console.log(`signature: ${signature}`)
      console.log(`message: ${message}`)

      // Verify the signed message is owned by the address.
      const isValid = this.bchjs.BitcoinCash.verifyMessage(
        address,
        signature,
        message
      )

      return isValid
    } catch (err) {
      console.error('Error in _validateSignature ')
      throw err
    }
  }
}

module.exports = PayToWriteAccessController
