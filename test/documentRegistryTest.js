const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentRegistry", function () {
  let DocumentRegistry, documentRegistry, owner, addr1;

  beforeEach(async function () {
    DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    [owner, addr1] = await ethers.getSigners();
    documentRegistry = await DocumentRegistry.deploy();
    await documentRegistry.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await documentRegistry.getOwner()).to.equal(owner.address);
    });
  });

  describe("Adding and Retrieving Documents", function () {
    it("Should allow the owner to add a document", async function () {
      const addTx = await documentRegistry.add(
        "QmHash123",
        1024,
        "pdf",
        "Sample Document"
      );
      const receipt = await addTx.wait();
      const timestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      const docCount = await documentRegistry.getDocumentsCount();
      expect(docCount).to.equal(1);

      const document = await documentRegistry.getDocument(0);
      expect(document.hash).to.equal("QmHash123");
      expect(document.dateAdded).to.equal(timestamp);
      expect(document.fileSize).to.equal(1024);
      expect(document.fileType).to.equal("pdf");
      expect(document.description).to.equal("Sample Document");
    });

    it("Should emit a DocumentAdded event", async function () {
      await expect(documentRegistry.add("QmHash456", 2048, "jpg", "Image File"))
        .to.emit(documentRegistry, "DocumentAdded")
        .withArgs("QmHash456", anyValue, 2048, "jpg", "Image File");
    });

    it("Should allow retrieving document stats only", async function () {
      await documentRegistry.add("QmHash789", 4096, "png", "Another Document");
      const stats = await documentRegistry.getDocumentStats(0);
      expect(stats.fileSize).to.equal(4096);
      expect(stats.fileType).to.equal("png");
    });
  });

  describe("Access Control", function () {
    it("Should revert if a non-owner tries to add a document", async function () {
      await expect(
        documentRegistry.connect(addr1).add("QmHashNonOwner", 1024, "txt", "Not Allowed")
      ).to.be.revertedWith("Not a contract owner");
    });
  });
});
