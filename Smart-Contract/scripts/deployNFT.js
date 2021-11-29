const { writeFileSync } = require('fs');

const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('NFTGAME');
    const gameContract = await gameContractFactory.deploy(
        ["cowber", "Cowel", "cower", "cow-friends" ,"cowner"],       // Names
        ["https://bafybeiedqjgz7e4f3wnrm4eowviusl4lkedd5bagw32i33eavikcb2b4hu.ipfs.dweb.link/cowber.jpg ", // Images
        "https://bafybeigjvgyxuuadgkhez2am2d6oxoaizkneozirtqzncpizmtpspbkwde.ipfs.dweb.link/Cowel.jpg", 
        "https://bafybeifsjb4rdrwpxhlfswec7gwjj3prf3ifapjao43chkta76kowagpti.ipfs.dweb.link/cower.jpg",
      "https://bafybeig2rhhiwe2fxyd3ntgrizwjydo5dlgnzkwjv6e2wjd3zguwtc7otm.ipfs.dweb.link/cow-friends.jpg",
      "https://bafybeiex5ao4rayeh5zxbf3ktpighk7rxjm77s7bzeqztv2ihmvqdwyflq.ipfs.dweb.link/cowner.jpg"
    ],
        [30, 50, 50, 60, 50],                    
        [10, 10, 8, 20, 5],
        "Farmer", 
        "https://bafybeiea37pqcmm7uv7y5ab52gvbticrlzsvtt5a5igd3bfsdlhwafhali.ipfs.dweb.link/farmer.jpg", 
         100, 
           5 
      );
    await gameContract.deployed();
    writeFileSync('deployNFT.json', JSON.stringify({
        NFTGAME: gameContract.address
    }, null, 1));
    console.log("Contract deployed to:", gameContract.address);
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
