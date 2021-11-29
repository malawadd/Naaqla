require('dotenv').config();
/** Connect to Moralis server */
const serverUrl = process.env.serverUrl ;
const appId = process.env.appId ;
Moralis.start({ serverUrl, appId });
let user = Moralis.User.current();



/** Add from here down */
async function login() {
  if (!user) {
   try {
    const chainId = "0x4"; //Ethereum Mainnet
    const chainIdHex = await Moralis.switchNetwork(chainId);
    console.log(chainIdHex)
    
    user = await Moralis.authenticate({ signingMessage: "Hello Dairy Farm" })
    
      initApp();

   } catch(error) {
     console.log(error)
   }
  }
  else{
     const web3 = await Moralis.enableWeb3();
    const chainId = "0x4"; //Ethereum Mainnet
    const chainIdHex = await Moralis.switchNetwork(chainId);
    console.log(chainIdHex)
    initApp();
  }
}

function initApp(){
    document.querySelector("#app").style.display = "block";
    document.querySelector("#submit_button").onclick = submit;
}

defineNewRecord = async (batchNumber,DT,Location,PackagingDetails) =>{
    const RecordHistory =  Moralis.Object.extend('Record');
    const record = new RecordHistory();
    record.set('batchNumber', batchNumber);
    record.set('DT', DT);
    record.set('Location', Location);
    record.set('PackagingDetails', PackagingDetails);
 ;

    const metadata = {
        batchNumber: batchNumber,
        DT: DT,
        Location: Location,
        PackagingDetails: PackagingDetails,
       
    }

    record.set('metadata', metadata);

    console.log(metadata);
    const jsonFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await jsonFile.saveIPFS();
    
    let metadataHash = jsonFile.hash();
    let ipfsLink = jsonFile.ipfs();
    console.log(jsonFile.ipfs())
    console.log(metadataHash)

    record.set('metadataHash', metadataHash);
    record.set('jsonFileIPFS', ipfsLink);

    
    // const SupplyChain = new web3.eth.Contract(scABI, scAddress);
    // await SupplyChain.methods.addBatch(metadataHash).send({from: user})
    // console.log(SupplyChain)

    const options = {
      contractAddress: scAddress,
      functionName: "addToChain",
      abi: scABI,
      params: {
        parentId:  batchNumber,
        contentCID : metadataHash,

        },
    };
      const receipt = await Moralis.executeFunction(options);
      console.log(receipt)


    await record.save();
    return record;

    
}

async function submit(){

    await defineNewRecord(
    document.querySelector('#input_BatchNumber').value,
    document.querySelector('#input_DT').value,
    document.querySelector('#input_Location').value,
     document.querySelector('#input_PackagingDetails').value,
    )

    
    document.querySelector('#success_message').innerHTML = 
        `Record Sumbitted. `;
    document.querySelector('#success_message').style.display = "block";
    setTimeout(() => {
        document.querySelector('#success_message').style.display = "none";
    }, 5000)
}

const scABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "parentId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "contentCID",
          "type": "string"
        }
      ],
      "name": "NewBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "parentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "childIds",
          "type": "uint256[]"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "contentCID",
          "type": "string"
        }
      ],
      "name": "UpdateBatch",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "contentCID",
          "type": "string"
        }
      ],
      "name": "addBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "parentId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "contentCID",
          "type": "string"
        }
      ],
      "name": "addToChain",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        }
      ],
      "name": "getBatch",
      "outputs": [
        {
          "components": [
            {
              "internalType": "enum SupplyChain.BatchSupply",
              "name": "supply",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "parentId",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "childIds",
              "type": "uint256[]"
            },
            {
              "internalType": "string",
              "name": "contentCID",
              "type": "string"
            }
          ],
          "internalType": "struct SupplyChain.Batch",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
const scAddress = '0xC8cBE97542d365D17F633645EAC7d8da8acdfCcF' 

login();
/** Useful Resources  */

// https://docs.moralis.io/moralis-server/users/crypto-login
// https://docs.moralis.io/moralis-server/getting-started/quick-start#user
// https://docs.moralis.io/moralis-server/users/crypto-login#metamask

/** Moralis Forum */

// https://forum.moralis.io/