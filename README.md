# Naaqla
`Chainlink Hackathon project`

## Introduction
Naaqla is a food tracking platform,  where users enter the product's ASIN for the registered companies and they can view the entire supply chain journey. 

Registered companies are issued dynamic NFTs containg different attributes, that are sold and traded on the market by local customers.

the tokeneconmics are simple companies gain more financial and social  exposure, while loyal customers gets  to be part of thier favorite brands and be involved in the process all the while everyone is making money. 

## Platform Overview

As of now there are three aspect of this platform : 

### Backend 
Where  all the moving parts of the supply chain from Farmer to wholesales departments are presented with form that they will fill to track the milk journey. 

### FrontEnd
a search engine where the consumer search with product sku to query for the milk journey.

### NFT
Farmers can release NFT for thier cattle, and even hold event that will result in huge prizes.

## Tech stack Used

- Ethereum
- web3storage
- Web3js
- React
- Javascript
- HardHat
- Moralis
- Alchemy


## Future Work
- Finish the search engine functionality.
-  streamLine the form updating process.
-  use chainlink oracles.
-  add more nft events .
-  add nft market place.
-

## Directory Structure


```
📦 Naaqla
 ┣ 📂 Forms-Morlis
 ┣    ┣ 📂collection (collection Form)
 ┃    ┣ 📂Distrubution (Distrubution Form)
 ┃    ┣	📂Farm (Farm Form)
 ┃    ┣ 📂Packaging (Packaging Form)
 ┃    ┣ 📂Search (Search Functionality )
 ┃    ┗ 📂Wholesales (Wholesales Form)
 ┣ 📂 smart-contract
 ┣    ┣ 📂artifacts (recent build of smart contract)
 ┃    ┣ 📂contract(Solidity smart contract)
 ┃    ┣	📂scripts(HardHat deployment migrations)
 ┃    ┣ 📂 test (Smart Contract Tests)
 ┃    ┣ 📜 package.json (project dependencies)
 ┃    ┗ 📜 hardhat-config.js (Hardhat Project Config)
 ┃
 ┣ 📂 NFT Game (NFT Game frontEnd)
 ┣ 📜 README.md (Project Documentation)
 ┣ 📜 avoiding_common_attacks.md
 ┣ 📜 design_pattern_decisions.md
 ┣ 📜 deployed_address.txt (contract address)
 ┗ 📜 package.json (project dependencies)
```

## Running the project

Run `npm i` to install dependencies.

### Smart Contracts

In the smart-contract directory :

1. Run `npm i` to install dependencies.
2. To compile supplychain contract run `npx hardhat run "./scripts/run"`
3. To compile nftGame contract run `npx hardhat run "./scripts/runNFT"`
4. To deploy run `npx hardhat run "./scripts/deploy" --network rinkeby `

### Frontend/To Start Local Server

1. In the NFT GAME  projects root directory, run `npm start`
2. in the Form-Moralis open the html files directly to access forms.


## Project Presntaion
 
 youTube  [Project walkthrough](https://youtu.be/2xLrlHg-wpU)