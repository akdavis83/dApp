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
// $("#linkSubmitBlog").click(() => {
//     showView("viewSubmitBlog");
// });

$("#linkGetDocuments").click(function () {
    $("#viewGetDocuments div").remove();
    showView("viewGetDocuments");
    viewGetDocuments();
});

// $("#linkGetBlogs").click(() => {
//     $("#viewGetBlogs div").remove(); // Clear previous content
//     showView("viewGetBlogs");
//     viewGetBlogs();
// });


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
// $("#blogUploadButton").click(uploadBlog);
$("#documentUploadButton").click(uploadDocument);

// === User Interface Interactions End ===
// async function uploadBlog() {
//     const title = $("#blogTitle").val();
//     const content = $("#blogContent").val();

//     if (!title || !content) {
//         showError("Please provide both title and content for the blog.");
//         return;
//     }

//     const signer = await provider.getSigner();
//     const contract = new ethers.BaseContract(documentRegistryContractAddress, documentRegistryContractABI, signer);

//     try {
//         // Upload blog content to IPFS (assuming IPFS is set up similarly)
//         const result = await IPFS.files.add(Buffer.from(content));
//         const ipfsHash = result[0].hash;

//         // Call the smart contract to store the blog metadata
//         const transaction = await contract.addBlog(ipfsHash, title);
//         showInfo("Blog uploaded with transaction hash: " + transaction.hash);
//     } catch (error) {
//         showError("Blog upload failed: " + error.message);
//     }
// }

// // Function to retrieve and display blogs
// async function viewGetBlogs() {
//     const contract = new ethers.BaseContract(documentRegistryContractAddress, documentRegistryContractABI, provider);

//     try {
//         const blogCount = await contract.getBlogsCount();

//         let html = $("<div>");
//         for (let index = 0; index < blogCount; index++) {
//             const blogData = await contract.getBlog(index);
//             const ipfsHash = blogData[0];
//             const title = blogData[1];
//             const dateAdded = new Date(blogData[2] * 1000).toLocaleDateString();

//             const blogContent = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`).then(res => res.text());

//             let blogDiv = $("<div>");
//             blogDiv.append(`<h3>${title}</h3>`);
//             blogDiv.append(`<p>Published on: ${dateAdded}</p>`);
//             blogDiv.append(`<p>${blogContent}</p>`);
//             html.append(blogDiv);
//         }
//         $("#viewGetBlogs").append(html);
//     } catch (error) {
//         showError("Failed to load blogs: " + error.message);
//     }
// }

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
				div.append($(`<img src="${ipfsUrl}" alt="Document Image" />`));
			  } else if (fileType === "application/pdf") {
				div.append(`<iframe src="${ipfsUrl}" width="100%" height="500px"></iframe>`);
			  } else if (fileType === "text/plain") {
				 // For plain text, fetch and display content
                await fetch(ipfsUrl)
                    .then(response => response.text())
                    .then(text => {
                        div.append(`<pre>${text}</pre>`);
                    })
                    .catch(error => {
                        div.append(`<p>Error loading text document: ${error.message}</p>`);
                    });
			  } else {
				div.append(`<p><a href="${ipfsUrl}" target="_blank">View Document</a></p>`);
			  }

            
            html.append(div);
        }
       
        $("#viewGetDocuments").append(html);
    } else {
        $("#viewGetDocuments").append("<div>No documents found in the registry.</div>");
    }
}
});