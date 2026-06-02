require("@nomicfoundation/hardhat-toolbox");

try {
  require("dotenv").config();
} catch (e) {
  console.log("dotenv not found, skipping");
}

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    bsc: {
      url: "https://bsc-dataseed1.bnbchain.org",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-2-s1.binance.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
  }
};
