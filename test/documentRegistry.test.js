const { expectRevert } = require("@openzeppelin/test-helpers");
const DocumentRegistry = artifacts.require("DocumentRegistry");

contract("DocumentRegistry", (accounts) => {
    let documentRegistry;
    const owner = accounts[0]; // The first account is typically the owner

    beforeEach(async () => {
        documentRegistry = await DocumentRegistry.new();
    });

    it("should only allow owner to call add function", async () => {
        const nonOwner = accounts[1];
        const validDocument = {
            hash: "QmValid",
            fileSize: 500,
            fileType: "pdf",
            description: "Valid test document"
        };
    
        // Add as owner - should succeed
        await documentRegistry.add(validDocument.hash, validDocument.fileSize, validDocument.fileType, validDocument.description, { from: owner });
        assert.equal(await documentRegistry.getDocumentsCount(), 1, "Document count should be 1 after owner's addition");
    
        // Attempt to add as non-owner - should revert
        await expectRevert(
            documentRegistry.add(validDocument.hash, validDocument.fileSize, validDocument.fileType, validDocument.description, { from: nonOwner }),
            "Not a contract owner"
        );
    });
    

    it("should not allow non-owners to add a document", async () => {
        const nonOwner = accounts[1]; // Another account that is not the owner
        const docHash = "somehash";
        const fileSize = 1234;
        const fileType = "pdf";
        const description = "Test document";
    
        // Check owner is set correctly
        assert.equal(await documentRegistry.getOwner(), owner, "Owner should match the deployer");
    
        await expectRevert(
            documentRegistry.add(docHash, fileSize, fileType, description, { from: nonOwner }),
            "Not a contract owner"
        );
    
        // Verify that no document was added
        const count = await documentRegistry.getDocumentsCount();
        assert.equal(count.toString(), "0", "Document count should be 0 since add was not allowed");
    });
    

    it("should revert add function when called by non-owner", async () => {
        const nonOwner = accounts[1]; // Define nonOwner here
        const ipfsHash = "Qm123";
        const fileSize = 123456;
        const fileType = "pdf";
        const description = "Test Document";

        await expectRevert(
            documentRegistry.add(ipfsHash, fileSize, fileType, description, { from: nonOwner }),
            "Not a contract owner"
        );
    });

    it("should return the correct documents count", async () => {
        const ipfsHash = "Qm123";
        const fileSize = 123456;
        const fileType = "pdf";
        const description = "Test Document";

        await documentRegistry.add(ipfsHash, fileSize, fileType, description, { from: owner });
        assert.equal(await documentRegistry.getDocumentsCount(), 1, "Document count should be 1");

        await documentRegistry.add("Qm456", 654321, "jpg", "Another Document", { from: owner });
        assert.equal(await documentRegistry.getDocumentsCount(), 2, "Document count should be 2");
    });

    it("should return the correct document metadata", async () => {
        const ipfsHash = "Qm123";
        const fileSize = 123456;
        const fileType = "pdf";
        const description = "Test Document";

        await documentRegistry.add(ipfsHash, fileSize, fileType, description, { from: owner });
        const document = await documentRegistry.getDocument(0);

        assert.equal(document.hash, ipfsHash, "Hash does not match");
        assert(document.dateAdded.toNumber() > 0, "Date added is not set");
        assert.equal(document.fileSize, fileSize, "File size does not match");
        assert.equal(document.fileType, fileType, "File type does not match");
        assert.equal(document.description, description, "Description does not match");
    });

    it("should return the document stats (fileSize, fileType)", async () => {
        const ipfsHash = "Qm123";
        const fileSize = 123456;
        const fileType = "pdf";
        const description = "Test Document";

        await documentRegistry.add(ipfsHash, fileSize, fileType, description, { from: owner });

        const stats = await documentRegistry.getDocumentStats(0);
        assert.equal(stats.fileSize, fileSize, "File size does not match");
        assert.equal(stats.fileType, fileType, "File type does not match");
    });

    it("should revert getDocument if index is out of range", async () => {
        await expectRevert(documentRegistry.getDocument(0), "revert");
    });

    it("should revert getDocumentStats if index is out of range", async () => {
        await expectRevert(documentRegistry.getDocumentStats(0), "revert");
    });
    it("should run a basic test", async () => {
        assert.equal(1, 1, "Basic test failed");
    });
    
});

