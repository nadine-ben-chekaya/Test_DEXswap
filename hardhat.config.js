require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {
  ETH_MAINNET_API_URL,
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.7.6",
  networks: {
    hardhat: {
      forking: {
        url: ETH_MAINNET_API_URL,
      },
    },
  },
};
