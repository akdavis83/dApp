// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DocumentRegistry.sol";

contract DocumentRegistryTest {
    DocumentRegistry documentRegistry;
    address owner;

    // Run before every test function
    function beforeEach() public {
        documentRegistry = new DocumentRegistry();
        owner = address(this);
    }

    function testContractOwnerSetCorrectly() public {
        address contractOwner = documentRegistry.contractOwner();
        Assert.equal(contractOwner, owner, "Owner should be set to the deploying address");
    }

    function testAddDocumentSuccessfully() public {
        string memory ipfsHash = "Qm123";
        uint fileSize = 123456;
        string memory fileType = "pdf";
        string memory description = "Test Document";

        uint dateAdded = documentRegistry.add(ipfsHash, fileSize, fileType, description);

        // Check that a document has been added
        (string memory hash, uint timestamp, uint size, string memory fType, string memory desc) = documentRegistry.getDocument(0);
        Assert.equal(hash, ipfsHash, "The IPFS hash should match the added document");
        Assert.equal(size, fileSize, "The file size should match the added document");
        Assert.equal(fType, fileType, "The file type should match the added document");
        Assert.equal(desc, description, "The description should match the added document");
        Assert.equal(timestamp, dateAdded, "The dateAdded should match the returned timestamp");
    }

    function testOnlyOwnerCanAddDocument() public {
        // Attempt to add a document from a non-owner account
        (bool success, ) = address(documentRegistry).call(
            abi.encodeWithSignature("add(string,uint256,string,string)", "QmTest", 123, "txt", "Non-owner attempt")
        );
        Assert.isFalse(success, "Only the owner should be able to add a document");
    }

    function testGetDocumentsCount() public {
        string memory ipfsHash1 = "Qm123";
        string memory ipfsHash2 = "Qm456";

        documentRegistry.add(ipfsHash1, 123456, "pdf", "First Document");
        documentRegistry.add(ipfsHash2, 654321, "jpg", "Second Document");

        uint documentCount = documentRegistry.getDocumentsCount();
        Assert.equal(documentCount, 2, "The document count should be 2");
    }

    function testGetDocumentMetadata() public {
        string memory ipfsHash = "Qm123";
        uint fileSize = 123456;
        string memory fileType = "pdf";
        string memory description = "Test Document";

        documentRegistry.add(ipfsHash, fileSize, fileType, description);

        (string memory hash, uint dateAdded, uint size, string memory fType, string memory desc) = documentRegistry.getDocument(0);
        Assert.equal(hash, ipfsHash, "The IPFS hash should match the added document");
        Assert.isAbove(dateAdded, 0, "The dateAdded should be greater than 0");
        Assert.equal(size, fileSize, "The file size should match the added document");
        Assert.equal(fType, fileType, "The file type should match the added document");
        Assert.equal(desc, description, "The description should match the added document");
    }

    function testGetDocumentStats() public {
        string memory ipfsHash = "Qm123";
        uint fileSize = 123456;
        string memory fileType = "pdf";
        string memory description = "Test Document";

        documentRegistry.add(ipfsHash, fileSize, fileType, description);

        (uint size, string memory fType) = documentRegistry.getDocumentStats(0);
        Assert.equal(size, fileSize, "The file size should match the added document");
        Assert.equal(fType, fileType, "The file type should match the added document");
    }

    function testInvalidIndexGetDocument() public {
        // Attempt to retrieve a document at an invalid index
        (bool success, ) = address(documentRegistry).call(
            abi.encodeWithSignature("getDocument(uint256)", 1)
        );
        Assert.isFalse(success, "Fetching a non-existent document should revert");
    }

    function testInvalidIndexGetDocumentStats() public {
        // Attempt to retrieve document stats at an invalid index
        (bool success, ) = address(documentRegistry).call(
            abi.encodeWithSignature("getDocumentStats(uint256)", 1)
        );
        Assert.isFalse(success, "Fetching stats for a non-existent document should revert");
    }
}
