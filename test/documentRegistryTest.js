const { expectRevert, time } = require("@openzeppelin/test-helpers");
const DocumentRegistry = artifacts.require("DocumentRegistry");

contract("DocumentRegistry", (accounts) => {
    const [owner, nonOwner] = accounts;
    let documentRegistry;

    beforeEach(async () => {
        documentRegistry = await DocumentRegistry.new({ from: owner });
    });

    it("should set the deployer as the contract owner", async () => {
        const contractOwner = await documentRegistry.contractOwner();
        assert.equal(contractOwner, owner, "Owner is not set correctly");
    });

    it("should add a document with metadata successfully", async () => {
        const ipfsHash = "Qm123";
        const fileSize = 123456;
        const fileType = "pdf";
        const description = "Test Document";

        // Add document
        const tx = await documentRegistry.add(ipfsHash, fileSize, fileType, description, { from: owner });

        // Validate event
        assert.equal(tx.logs[0].event, "DocumentAdded", "DocumentAdded event should be emitted");

        // Validate document data
        const document = await documentRegistry.getDocument(0);
        assert.equal(document.hash, ipfsHash, "Hash does not match");
        assert.equal(document.fileSize, fileSize, "File size does not match");
        assert.equal(document.fileType, fileType, "File type does not match");
        assert.equal(document.description, description, "Description does not match");
    });

    it("should revert add function when called by non-owner", async () => {
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
});
