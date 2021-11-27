const main = async () => {
    const ContractFactory = await hre.ethers.getContractFactory('SupplyChain');
    const SuplyChainContract = await ContractFactory.deploy();
    await SuplyChainContract.deployed();
    console.log("Contract deployed to:", SuplyChainContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();