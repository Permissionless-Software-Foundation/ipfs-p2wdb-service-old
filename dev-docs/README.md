# Developer Documentation

This directory contains Markdown documents which describe the architecture of the pay-to-write database (P2WDB). The one-sentence description of the P2WDB is: "a peer-to-peer database based on [OrbitDB](https://github.com/orbitdb/orbit-db) that requires proof-of-burn in order to add entries to the database". The documents in this directory serve to expand on that statement, and describe all the subcomponents that go into that idea.

## OrbitDB

[OrbitDB](https://github.com/orbitdb/orbit-db) is a peer-to-peer (p2p), append-only 'database' that runs on top of [IPFS](https://ipfs.io), using [pubsub channels](https://docs.libp2p.io/concepts/publish-subscribe/). This software is at the heart of the P2WDB concept. Stop here and understand OrbitDB before continuing, as not much will make sense without a strong understanding of what OrbitDB is and how it works.

The biggest change that P2WDB makes is to add a custom [Access Control Library](https://github.com/orbitdb/orbit-db-access-controllers) (ACL) to OrbitDB. This ACL requires that users submit a proof-of-burn in order to write data to the database. Anyone can read from the database.

## Proof-of-Burn

The 'big innovation' in this project is to combine OrbitDB with a proof-of-burn to control database writes. The proof-of-burn is simply a transaction ID (TXID) on a blockchain. Each independent copy of the P2WDB will evaluate this transaction and verify that the transaction involves burning a specific quantity of a specific token. If those criteria are met, then the user is allowed to write data to the database. Otherwise the write request is rejected. Each instance of the P2WDB independently validates these write entries, similar to blockchain.

The ACL rules become part of the hash for the database name. If a malicious user attempts to re-write the ACL rules for their instance of the P2WDB, they will only succeed in creating a new database. Their node will be isolated and other nodes running the consensus version of the database will not recognize it.

Right now the Bitcoin Cash (BCH) blockchain is used for the proof-of-burn, but one goal of this project is to expand the proof-of-burn to other blockchain, including [Avalanche](https://www.avax.network/) and [eCash](https://e.cash). Implementing interfaces for different blockchains will allow the P2WDB to become a medium for cross-blockchain communication. For example, an event on one blockchain could trigger a smart contract or Script on another blockchain.

Currently, the proof of burn requires 0.01 [PSF tokens](https://psfoundation.cash) burned in order to write 10KB of text data to the database. These numbers will probably change in the future, but these are what is currently implemented. [Example scripts](../examples) are provided to help developers interact with the database.

## P2WDB API & RPC

There are two network interfaces for the P2WDB:

- REST API over HTTP
- JSON RPC over IPFS

Both interfaces are maintained in the [ipfs-service-provider](https://github.com/Permissionless-Software-Foundation/ipfs-service-provider) repository, and are not directly maintained in the ipfs-p2wdb-service repository. Instead, changes around the interfaces are either pushed or pulled from the upstream ipfs-service-provider repository.

The REST API is based on this [koa boilerplate](https://github.com/christroutner/koa-api-boilerplate). It allows the P2WDB to be interfaced with conventional Web 2.0 technology. It's expected that the P2WDB will be bundled with additional software, probably using Docker containers. The REST API provides a great way for orchestrated software to communicate, both via intranet or internet.

The JSON RPC is based on the [ipfs-coord](https://github.com/Permissionless-Software-Foundation/ipfs-coord#readme) library. This library uses IPFS pubsub channels to allow new IPFS nodes to quickly find one another and establish an end-to-end encrypted (e2ee) connection. They can then communicate by passing JSON RPC commands.

Reads and writes to the P2WDB can be accomplished over either REST API over HTTP or JSON RPC over IPFS. Which one is preferable depends on the use-case. Here is the software dependency tree for the software stack making up the P2WDB interfaces:

![ipfs-p2wdb-service dependency graph](./diagrams/dependency-graph.png)

## Reprecussions of this Technology

Once the basic components are understood, it's possible to take a step back and assess the repercussions of this technology. The P2WDB functions in a similar manner to a blockchain, but without a lot of the overhead and cost the blockchains incur. Here are just a few applications that can be unlocked by the P2WDB technology:

- Cross-blockchain communication
- The [SLP token specification](https://github.com/simpleledger/slp-specifications/blob/master/slp-token-type-1.md) could be ported to create a single token protocol that is accessible by multiple blockchains.
- Uncensorable, community-driven marketplaces. An uncensorable version of [Craigslist](https://craigslist.org) for example. Or a decentralized exchange (DEX) for trading cryptocurrencies.

This idea not only compliments blockchains, but improves upon them by creating a much more flexible and scalable data layer. Because it rides on the IPFS network, databases can be archived on Filecoin.
