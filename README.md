# ipfs-p2wdb-service

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is a fork of [ipfs-service-provider](https://github.com/Permissionless-Software-Foundation/ipfs-service-provider). This project ports the pay-to-write (P2W) database (DB) code from [this older project](https://github.com/Permissionless-Software-Foundation/pay-to-write-orbitdb) and adds it to the ipfs-service-provider boilerplate code in order to add both a REST API over HTTP interface and JSON RPC over IPFS interface to access the P2WDB services.

Two API endpoints are currently implemented:

- Write - add an entry to the database.
- Read all - read all entries in the database.

Each endpoint is available over two interfaces:

- A REST API over HTTP
- A JSON RPC over IPFS, using [chat.fullstack.cash](https://chat.fullstack.cash)

This project is under heavy development and is only appropriate for use by JavaScript developers familiar with REST API or JSON RPC development.

## Setup Development Environment

The development environment is assumed to be Ubuntu Linux.

- Clone this repository.
- Install dependencies with `npm install`
- If MongoDB is not installed, install it by running the `./install-mongo.sh` script
- Run tests with `npm test`
- Start with `npm start`

## Docker container

Coming soon.

## License

[MIT](./LICENSE.md)
