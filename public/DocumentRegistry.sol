// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract DocumentRegistry {
    struct Document {
        string hash;
        uint256 dateAdded;
        uint256 fileSize;     // Size of the file in bytes
        string fileType;      // Type of the file, e.g., "pdf", "jpg"
        string description;   // Optional description of the file
    }
    
    struct Blog {
        string contentHash;
        uint256 dateAdded;
        string title;         // Title of the blog post
        string author;        // Author's name
    }

    Document[] private documents;
    Blog[] private blogs;
    address private contractOwner;

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not a contract owner");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    // Add this function to get the contract owner
    function getOwner() public view returns (address) {
        return contractOwner;
    }

    // Event emitted when a new document is added
    event DocumentAdded(string hash, uint256 dateAdded, uint256 fileSize, string fileType, string description);

    // Event emitted when a new blog post is added
    event BlogAdded(string contentHash, uint256 dateAdded, string title, string author);

    // Function to add a new document with additional metadata
    function addDocument(
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
        
        emit DocumentAdded(hash, currentTime, fileSize, fileType, description);
        return currentTime;
    }

    // Function to add a new blog post
    function addBlog(
        string memory contentHash,
        string memory title,
        string memory author
    ) public onlyOwner returns (uint256 dateAdded) {
        uint256 currentTime = block.timestamp;
        Blog memory blog = Blog({
            contentHash: contentHash,
            dateAdded: currentTime,
            title: title,
            author: author
        });
        blogs.push(blog);
        
        emit BlogAdded(contentHash, currentTime, title, author);
        return currentTime;
    }

    // Get the total number of documents
    function getDocumentsCount() public view returns (uint256) {
        return documents.length;
    }

    // Get the total number of blog posts
    function getBlogsCount() public view returns (uint256) {
        return blogs.length;
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

    // Retrieve a blog post's basic information
    function getBlog(uint256 index) public view returns (
        string memory contentHash,
        uint256 dateAdded,
        string memory title,
        string memory author
    ) {
        Blog memory blog = blogs[index];
        return (
            blog.contentHash,
            blog.dateAdded,
            blog.title,
            blog.author
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
