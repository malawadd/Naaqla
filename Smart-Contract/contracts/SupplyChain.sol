// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

/**
 * @title Contract for diray supplyChain
 * @author Khawla H.
 * @notice Allows a user to put up their electronics for recycling and get rewarded
 * @dev Recyclables will be tracked and ether will be sent as a reward
 */
contract SupplyChain is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private batchIdCounter;

    enum BatchSupply {
        ORIGIN,
        CHAIN
    }

    struct Batch {
        BatchSupply supply;
        uint256 id;
        uint256 parentId;
        uint256[] childIds;
        string contentCID;
    }

    mapping(uint256 => Batch) private batch;

    event NewBatch(
        uint256 indexed id,
        uint256 indexed parentId,
        string indexed contentCID
        // address indexed Farm
    );

    event UpdateBatch(
        uint256 indexed id,
        uint256 indexed parentId,
        uint256[] childIds,
        string indexed contentCID
    );

    function addBatch(string memory contentCID) public {
        batchIdCounter.increment();
        uint256 id = batchIdCounter.current();
        uint256[] memory childIds;
        batch[id] = Batch(BatchSupply.ORIGIN, id, 0, childIds, contentCID);
        emit NewBatch(id, 0, contentCID);
    }

    function getBatch(uint256 batchId) public view returns (Batch memory) {
        require(batch[batchId].id == batchId, "No batch found");
        return batch[batchId];
    }

    function addToChain(uint256 parentId, string memory contentCID) public {
        require(batch[parentId].id == parentId, "Parent item does not exist");

        batchIdCounter.increment();
        uint256 id = batchIdCounter.current();
        batch[parentId].childIds.push(id);
        uint256[] memory childIds;
        batch[id] = Batch(
            BatchSupply.CHAIN,
            id,
            parentId,
            childIds,
            contentCID
        );
        emit UpdateBatch(id, parentId, childIds, contentCID);
    }
}
