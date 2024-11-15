$(document).ready(function () {
  try {
    window.ethereum.enable();
  } catch (e) {
    alert("Access Denied.");
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const documentRegistryContractAddress = "0x0C0BA06f0940F2bcF645143700C877D9f32c2051";

  const documentRegistryContractABI =   [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "fileSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "fileType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "add",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "dateAdded",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dateAdded",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fileSize",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fileType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "DocumentAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getDocument",
		"outputs": [
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateAdded",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fileSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "fileType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDocumentsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "documentCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getDocumentStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "fileSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "fileType",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
  
  const IPFS = window.IpfsApi("localhost", "5004");
  const Buffer = IPFS.Buffer;

  // === User Interface Handlers Start ===

  $("#linkHome").click(function () {
    showView("viewHome");
});

$("#linkSubmitDocument").click(function () {
    showView("viewSubmitDocument");
});

$("#linkGetDocuments").click(function () {
    $("#viewGetDocuments div").remove();
    showView("viewGetDocuments");
    viewGetDocuments();
});




// Attach AJAX "loading" event listener
$(document).on({
    ajaxStart: function () {
        $("#loadingBox").show();
    },
    ajaxStop: function () {
        $("#loadingBox").hide();
    },
});

function showView(viewName) {
    // Hide all views and show the selected view only
    $("main > section").hide();
    $("#" + viewName).show();
}

function showInfo(message) {
    $("#infoBox>p").html(message);
    $("#infoBox").show();
    $("#infoBox>header").click(function () {
        $("#infoBox").hide();
    });
}

function showError(errorMsg) {
    $("#errorBox>p").html("Error: " + errorMsg);
    $("#errorBox").show();
    $("#errorBox>header").click(function () {
        $("#errorBox").hide();
    });
}

$("#documentUploadButton").click(uploadDocument);

async function uploadDocument() {
    if ($("#documentForUpload")[0].files.length === 0) {
        showError("Please select a file to upload!");
        return;
    }

    const file = $("#documentForUpload")[0].files[0];
    const description = $("#description").val();
    if (!description) {
        showError("Please enter a description for the document.");
        return;
    }

    const signer = await provider.getSigner();
    const fileReader = new FileReader();

    fileReader.onload = async function () {
        const fileBuffer = Buffer.from(fileReader.result);
        const contract = new ethers.BaseContract(documentRegistryContractAddress, documentRegistryContractABI, signer);

        // Upload to IPFS
        IPFS.files.add(fileBuffer, (err, result) => {
            if (err) {
                showError(err);
                return;
            }
            if (result) {
                const ipfsHash = result[0].hash;
                const fileSize = file.size;
                const fileType = file.type;

                // Call the smart contract to store the file metadata
                contract.add(ipfsHash, fileSize, fileType, description)
                    .then((transaction) => {
                        showInfo("Transaction: " + transaction.hash);
                        return transaction;
                    })
                    .catch((error) => {
                        showError("Smart contract call failed: " + error);
                    });
            }
        });
    };

    fileReader.readAsArrayBuffer(file);
}


async function viewGetDocuments() {
    let contract = new ethers.BaseContract(documentRegistryContractAddress, documentRegistryContractABI, provider);

    await contract.getDocumentsCount()
    .then((r) => { documentsCount = r; })
    .catch((error) => {
        showError("Smart contract call failed: " + error);
        return;
    });

    console.log(documentsCount.toString());

    if (documentsCount > 0) {
        let html = $("<div>");
        for (let index = 0; index < documentsCount; index++) {
            let ipfsHash = "";
            let contractPublishDate = 0;
            let fileSize = 0;
            let fileType = "";
            let description = "";

            await contract.getDocument(index)
            .then((doc) => {
                ipfsHash = doc[0];
                contractPublishDate = doc[1];
                fileSize = doc[2];
                fileType = doc[3];
                description = doc[4];
            })
            .catch((error) => {
                showError("Smart contract call failed: " + error);
                return;
            });

            console.log(`Document hash: ${ipfsHash.toString()}, contractPublishDate: ${contractPublishDate}, fileSize: ${fileSize}, fileType: ${fileType}, description: ${description}`);

            let div = $("<div>");
            let url = `https://ipfs.io/ipfs/${ipfsHash}`;
            let displayDate = new Date(Number(contractPublishDate) * 1000).toLocaleDateString();
            div.append($(`<p>Document published on: ${displayDate}</p>`));
            div.append($(`<p>File Size: ${fileSize} bytes</p>`));
            div.append($(`<p>File Type: ${fileType}</p>`));
            div.append($(`<p>File Hash: ${ipfsHash}</p>`));
            div.append($(`<p>Description: ${description}</p>`));
            div.append($(`<img src="${url}" />`));
            // Generate the IPFS URL
            const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

			if (fileType.startsWith("image/")) {
				div.append(`<img src="${ipfsUrl}" alt="Document Image" />`);
			} else if (fileType === "application/pdf") {
				div.append(`<iframe src="${ipfsUrl}" width="100%" height="500px"></iframe>`);
			} else {
				div.append(`<a href="${ipfsUrl}" target="_blank">View Document</a>`);
			}
			
            html.append(div);
        }
       
        $("#viewGetDocuments").append(html);
    } else {
        $("#viewGetDocuments").append("<div>No documents found in the registry.</div>");
    }
}
});