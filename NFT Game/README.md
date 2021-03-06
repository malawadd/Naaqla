# Abstract Attacks(NFT Game)
`Consensys Bootcamp Project`

## Introduction
Abstract Attacks is a 2d NFT Game, that uses dynamic genertated NFTs, the nft themselves are generated with the help of an optimization generative model called CLIP+QVGAN.

the game Allows the player to ment one of the three provided NFTs , and attack a boss, the boss have a lot of health so it can only be defeated by multiple people all attacking together.

The NFT health is not regainable , so each player have a fixed amount of attack they can land on the boss before it health is depreciated.

The NFT stats in updated in realtime after each attack, and viewable on Openseas and rarible.

## Platform Overview

The Players Flow interacting with the smart contract in the frontend is as follow :

1. Player login using metamask.
2. Player is promoted to mint a character.
3. Player is put in the arena aginst the boss ready to attack.
4. Player attack the boss until thier nft dies.

## Tech stack Used

- Ethereum
- web3storage
- Web3js
- HTML
- CSS
- React
- Javascript
- Truffle

## Future Work

- Add a functionality that allow users to generated thier own unique nft
- Add chainlink keepers to add a variartiy of game mechanics (revive, potions..etc)
- Add chainlink VRF to allow more RNG (critical attack, healing, immunity..etc ).
- Add tokeneconomics to the game, and reward players.
- Improve the visual aspect to the game.
- Allow players to see other players.
- Add more bosses and more characters.

## Directory Structure

```
π¦ DECENTRALIZED_SOCIAL_MEDIA
 β£ π public
 β£ π smart-contract
 β£    β£ πbuild (recent build of smart contract)
 β    β£ πcontract(Solidity smart contract)
 β    β£	πmigration(Truffle deployment migrations)
 β    β£ π test (Smart Contract Tests)
 β    β£ π package.json (project dependencies)
 β    β π truffle-config.js (Truffle Project Config)
 β
 β£ π src (Dapp Frontend)
 β£ π README.md (Project Documentation)
 β£ π avoiding_common_attacks.md
 β£ π design_pattern_decisions.md
 β£ π deployed_address.txt (contract address)
 β π package.json (project dependencies)
```

## Running the project

Run `npm i` to install dependencies.

### Smart Contracts

In the smart-contract directory :

1. Run `npm i` to install dependencies.
2. To compile contracts run `truffle compile`
3. To deploy run `truffle migrate`
4. To test run `truffle test`
5. Rrun `ganache-cli` to start a local chain.
6. Run `truffle console` to interact with the porject.

### Frontend/To Start Local Server

1. In the projects root directory, run `npm start`

## Project Demo

Website π [Abstract Attacks Demo](https://orange-lake-7069.on.fleek.co/)

YouTube π [Project walkthrough](https://youtu.be/2xLrlHg-wpU)

## Avoiding Common Attacks

Documented here π [avoiding_common_attacks.md](avoiding_common_attacks.md)

## Deployed Addresses

Documented here π [deployed_addresses.txt](deployed_addresses.txt)

## Design Pattern Decisions

Documented here π [design_pattern_decisions.md](design_pattern_decisions.md)

`send certificate : 0xe21A9bC92838fEDB1F1B7A601f526816F28871c2`
