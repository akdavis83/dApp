// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

contract DocumentRegistry {
    struct Document {
        string hash;
        uint256 dateAdded;
        uint256 fileSize;     // Size of the file in bytes
        string fileType;      // Type of the file, e.g., "pdf", "jpg"
        string description;   // Optional description of the file
    }

    Document[] private documents;
    address private contractOwner;

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not a contract owner");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    // Function to add a new document with additional metadata
    function add(
        string memory hash,
        uint256 fileSize,
        string memory fileType,
        string memory description
    ) public onlyOwner returns (uint256 dateAdded) {
        uint256 currentTime = block.timestamp;
        Document memory doc = Document({
            hash: hash,
            dateAdded: currentTime,
            fileSize: fileSize,
            fileType: fileType,
            description: description
        });
        documents.push(doc);
        return currentTime;
    }

    // Get the total number of documents
    function getDocumentsCount() public view returns (uint256 documentCount) {
        return documents.length;
    }

    // Retrieve a document's basic information
    function getDocument(uint256 index) public view returns (
        string memory hash,
        uint256 dateAdded,
        uint256 fileSize,
        string memory fileType,
        string memory description
    ) {
        Document memory document = documents[index];
        return (
            document.hash,
            document.dateAdded,
            document.fileSize,
            document.fileType,
            document.description
        );
    }

    // Retrieve only the file stats of a document
    function getDocumentStats(uint256 index) public view returns (
        uint256 fileSize,
        string memory fileType
    ) {
        Document memory document = documents[index];
        return (
            document.fileSize,
            document.fileType
        );
    }
}
