// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

// Our contract inherits from ERC721, which is the standard NFT contract!
contract NFTGAME is ERC721, VRFConsumerBase, KeeperCompatibleInterface {
    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;
    //charater struck
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 milkProduced;
        uint256 maxMilkProduced;
        uint256 milk;
    }

    // The tokenId is the NFTs unique identifier, it's just a number that goes
    // 0, 1, 2, 3, etc.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // A lil array to help us hold the default data for our characters.
    // This will be helpful when we mint new characters and need to know
    // things like their milkProduced, AD, etc.

    CharacterAttributes[] defaultCharacters;

    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // A mapping from an address => the NFTs tokenId. Gives me an ez way
    // to store the owner of the NFT and reference it later.
    mapping(address => uint256) public nftHolders;

    //boss

    struct BigFarmer {
        string name;
        string imageURI;
        uint256 milkNeeded;
        uint256 maxMilkNeeded;
        uint256 milk;
    }

    BigFarmer public bigFarmer;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(
        uint256 newbossmilkNeeded,
        uint256 newPlayermilkProduced
    );

    event RestoreHealth(uint256 oldbossmilkNeeded, uint256 newbossmilkNeeded);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory charactermilkProduced,
        uint256[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossmilkNeeded,
        uint256 bossMilk
    )
        ERC721("ResolveFarm", "reFram")
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709 // LINK Token
        )
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18; // 0.1 LINK (Varies by network)

        // Initialize the boss. Save it to our global "bigFarmer" state variable.
        bigFarmer = BigFarmer({
            name: bossName,
            imageURI: bossImageURI,
            milkNeeded: bossmilkNeeded,
            maxMilkNeeded: bossmilkNeeded,
            milk: bossMilk
        });
        console.log(
            "Done initializing boss %s w/ milkProduced %s, img %s",
            bigFarmer.name,
            bigFarmer.milkNeeded,
            bigFarmer.imageURI
        );

        // Loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.

        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    milkProduced: charactermilkProduced[i],
                    maxMilkProduced: charactermilkProduced[i],
                    milk: characterAttackDmg[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];
            console.log(
                "Done initializing %s w/ milkProduced %s, img %s",
                c.name,
                c.milkProduced,
                c.imageURI
            );
        }
        // I increment tokenIds here so that my first NFT has an ID of 1.
        // More on this in the lesson!
        _tokenIds.increment();
    }

    // Users would be able to hit this function and get their NFT based on the
    // characterId they send in!
    function mintCharacterNFT(uint256 _characterIndex) external {
        // Get current tokenId (starts at 1 since we incremented in the constructor).
        uint256 newItemId = _tokenIds.current();
        // The magical function! Assigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        // We map the tokenId => their character attributes. More on this in
        // the lesson below.

        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            milkProduced: defaultCharacters[_characterIndex].milkProduced,
            maxMilkProduced: defaultCharacters[_characterIndex].milkProduced,
            milk: defaultCharacters[_characterIndex].milk
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        // Keep an easy way to see who owns what NFT.

        nftHolders[msg.sender] = newItemId;
        // Increment the tokenId for the next person that uses it
        _tokenIds.increment();

        // emit event
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    //////////// function ////////////

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strmilkProduced = Strings.toString(
            charAttributes.milkProduced
        );
        string memory strmaxMilkProduced = Strings.toString(
            charAttributes.maxMilkProduced
        );
        string memory strmilk = Strings.toString(charAttributes.milk);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        charAttributes.name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "This is an NFT that lets people play in the  Resolve Farm! event", "image": "',
                        charAttributes.imageURI,
                        '", "attributes": [ { "trait_type": " milk_production_ARR", "value": ',
                        strmilkProduced,
                        ', "max_value":',
                        strmaxMilkProduced,
                        '}, { "trait_type": "milk_Production", "value": ',
                        strmilk,
                        "} ]}"
                    )
                )
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];
        console.log(
            "\nPlayer w/ character %s about to offer Milk Prodiction. Has %s milk and %s milkProduced",
            player.name,
            player.milkProduced,
            player.milk
        );
        console.log(
            "Boss %s has %s milkneeded and %s milk exhaust",
            bigFarmer.name,
            bigFarmer.milkNeeded,
            bigFarmer.milk
        );
        // Make sure the player has more than 0 milkProduced.
        require(
            player.milkProduced > 0,
            "Error: character must have milkProduced to offer milk to  boss."
        );

        // Make sure the boss has more than 0 milkProduced.
        require(bigFarmer.milkNeeded > 0, "Error: boss dont need any milk.");
        // Allow player to attack boss.
        if (bigFarmer.milkNeeded < player.milk) {
            bigFarmer.milkNeeded = 0;
        } else {
            bigFarmer.milkNeeded =
                bigFarmer.milkNeeded -
                (player.milk + (player.milk * randomResult));
            console.log("Random result is: %s ", randomResult);
        }
        // Allow boss to attack player.
        if (player.milkProduced < bigFarmer.milk) {
            player.milkProduced = 0;
        } else {
            player.milkProduced = player.milkProduced - bigFarmer.milk;
        }

        // Console for ease.
        console.log(
            "Player attacked boss. New boss milkProduced: %s",
            bigFarmer.milkNeeded
        );
        console.log(
            "Boss attacked player. New player milkProduced: %s\n",
            player.milkProduced
        );

        emit AttackComplete(bigFarmer.milkNeeded, player.milkProduced);
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        // Get the tokenId of the user's character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character.
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        // Else, return an empty character.
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    //  Retrieve all default characters.

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    // Retrieve the boss

    function getBigFarmer() public view returns (BigFarmer memory) {
        return bigFarmer;
    }

    function RestoreBossHealth() public {
        uint256 oldhealth = bigFarmer.milkNeeded;
        bigFarmer.milkNeeded = bigFarmer.maxMilkNeeded;
        emit RestoreHealth(oldhealth, bigFarmer.milkNeeded);
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = (randomness % 50) + 1;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = bigFarmer.milkNeeded <= 0;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        bigFarmer.milkNeeded = bigFarmer.maxMilkNeeded;
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }
}
