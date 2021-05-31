const tx = {
  txid: 'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0',
  hash: 'dc6a7bd80860f58e392d36f6da0fb32d23eb52f03447c11a472c32b2c1267cd0',
  version: 2,
  size: 260,
  locktime: 0,
  vin: [
    {
      txid: '3dd1c2c59cce83e578a0b94c59c206a814a2b6c5a0b8986df470a630493e54a3',
      vout: 0,
      scriptSig: {},
      sequence: 4294967295
    }
  ],
  vout: [
    { value: 0.00005196, n: 0, scriptPubKey: [Object] },
    {
      value: 0.00002,
      n: 1,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 203b64bfbaa9e58333295b621159ddebc591ecb1 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914203b64bfbaa9e58333295b621159ddebc591ecb188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qpnty9t0w93fez04h7yzevujpv8pun204qv6yfuahk']
      }
    },
    { value: 0.00008527, n: 2, scriptPubKey: {} }
  ]
}

module.exports = {
  tx
}
