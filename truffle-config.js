module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555, // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01 // <-- Use this low gas price
    },
  },
  plugins: ["solidity-coverage"],
  
  compilers: {
    solc: {
      version: "0.8.7+commit.e28d00a7.Emscripten.clang", // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
} 