# DocumentRegistry Smart Contract

# Overview
-The DocumentRegistry smart contract is designed to allow a designated owner to register documents with metadata including file size, file type, and an optional description. Only the contract owner can add new documents, making this registry suitable for a controlled environment where entries must be authorized.

# License and Compiler Version
-solidity

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
-Contract Elements
-State Variables
-documents: An array storing each registered document as a Document struct.
-contractOwner: The address of the contract owner, which is set to the deploying address upon contract creation.

# Structs
-Document: Represents a file with associated metadata.
-hash: The unique hash of the document (e.g., an IPFS hash).
-dateAdded: The timestamp indicating when the document was added.
-fileSize: The size of the document in bytes.
-fileType: The type of file (e.g., "pdf", "jpg").
-description: An optional description of the document.

# Modifiers
-onlyOwner: Restricts access to specific functions, allowing only the contract owner to call them.

# Events
-DocumentAdded: Emitted when a new document is added to the registry.

# Parameters:
-hash: The hash of the document.
-dateAdded: The timestamp of when the document was added.
-fileSize: The file size in bytes.
-fileType: The type of file.
-description: An optional description of the document.

# Constructor
-constructor(): Sets the deploying address as the contract owner.
-Functions
-Public Functions
-getOwner()

-Retrieves the address of the contract owner.
-Returns: address - The owner’s address.
-add(string memory hash, uint256 fileSize, string memory fileType, string memory description)

-Adds a new document to the registry with the specified metadata. Only the contract owner can call this function.
-Emits the DocumentAdded event.

# Parameters:
-hash: The document’s unique hash (e.g., IPFS hash).
-fileSize: The size of the document in bytes.
-fileType: The document type (e.g., "pdf").
-description: An optional description of the document.
-Returns: uint256 - The timestamp (dateAdded) of when the document was added.
-getDocumentsCount()

-Retrieves the total number of documents stored in the registry.
-Returns: uint256 - The total count of documents.
-getDocument(uint256 index)

-Retrieves the metadata of a document at a specific index in the documents array.

# Parameters:
-index: The index of the document within the documents array.
-Returns:
-string - The document hash.
-uint256 - The date the document was added.
-uint256 - The file size in bytes.
-string - The file type.
-string - The document description.
-getDocumentStats(uint256 index)

-Retrieves only the file size and file type of a document at a specific index.

# Parameters:
-index: The index of the document within the documents array.
-Returns:
-uint256 - The file size in bytes.
-string - The file type.
-Usage

# Adding Documents:

-Only the contract owner can add documents using the add function.
-The function takes metadata about the document and stores it in the documents array.
-Adding a document emits a DocumentAdded event containing the document’s metadata.

# Retrieving Information:

-Use getDocumentsCount to get the total number of documents in the registry.
-Use getDocument to retrieve all metadata about a specific document.
-Use getDocumentStats to retrieve only the file size and file type of a specific document.

# Notes
-Only Contract Owner Access: The onlyOwner modifier restricts document addition to the contract owner, ensuring that only authorized documents are added.
-Event Logging: The DocumentAdded event logs metadata for each added document, allowing off-chain applications to track document additions in real-time.
-Off-Chain Storage: The contract stores document metadata, but not the actual document content, which should be stored off-chain (e.g., on IPFS or another decentralized storage solution).