const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');

async function deploy(name, ...params) {
    const Contract = await ethers.getContractFactory(name);
    return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {
    const supplychain = await deploy("SupplyChain");
    writeFileSync('deploy.json', JSON.stringify({
        SupplyChain: supplychain.address
    }, null, 1));

    console.log(`supplychain: ${supplychain.address}`)
}

  



if (require.main === module) {
    main().then(() => process.exit(0))
      .catch(error => { console.error(error); process.exit(1); });
  }
  


