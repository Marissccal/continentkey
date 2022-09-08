const CKNFT_ADDRESS_LOCALHOST = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const CKNFT_ADDRESS_RINKEBY = "0x5A645382133432b61c2e069de386Bb1364E74aFe"; // old contract
// const CKNFT_ADDRESS_RINKEBY = "0xae454458411B5edc9BFf4293826A39433e1c1Fa2"; // old contract
const CKNFT_ADDRESS_RINKEBY = "0x8eA6C85C47Fb969a7f39998607c2453222c83890";
const CKNFT_ADDRESS_MAINNET = "0x833696cc64e68A7cf5A045256420bF7dF3bA8bB6";
const CKNFT_ADDRESS_GOERLI = "0x2A8fD25eD062Afd2703dAD6bd60d0D4D8a62D75F";
const CKNFT_ADDRESS_POLYGON = "0xB69a9a11E5CaE236FE18d6aF43df493545807625";

const deploymentOptions = ["localhost", "goerli", "mainnet", "rinkeby", "polygon"];
const DEPLOY_TO = deploymentOptions[1]; // change this for localhost vs testnet vs mainnet

export let CKNFT_ADDRESS;
export let CORRECT_CHAIN_ID;
export let NAME_CHAIN_ID;
export let OPENSEA_URL;
export let ETHERSCAN_URL;
if (DEPLOY_TO === deploymentOptions[0]) {
  // polygon
 CKNFT_ADDRESS = CKNFT_ADDRESS_POLYGON;
 CORRECT_CHAIN_ID = "0x89"; // 137
 NAME_CHAIN_ID = 'matic'
 OPENSEA_URL = "https://opensea.io";
 ETHERSCAN_URL = "https://polygonscan.com";
} else if (DEPLOY_TO === deploymentOptions[1]) {
   // rinkeby
CKNFT_ADDRESS = CKNFT_ADDRESS_RINKEBY;
CORRECT_CHAIN_ID = "0x4"; // 4
NAME_CHAIN_ID = 'rinkeby'
OPENSEA_URL = "https://testnets.opensea.io";
ETHERSCAN_URL = "https://rinkeby.etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[2]) {
  // mainnet
  CKNFT_ADDRESS = CKNFT_ADDRESS_MAINNET;
  CORRECT_CHAIN_ID = "0x1"; // 1
  NAME_CHAIN_ID = 'ethereum'
  OPENSEA_URL = "https://opensea.io";
  ETHERSCAN_URL = "https://etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[3]) {
  // goerli
 CKNFT_ADDRESS = CKNFT_ADDRESS_GOERLI;
 CORRECT_CHAIN_ID = "0x5"; // 5
 NAME_CHAIN_ID = 'goerli'
 OPENSEA_URL = "https://testnets.opensea.io";
 ETHERSCAN_URL = "https://goerli.etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[4]) {
  // localhost
CKNFT_ADDRESS = CKNFT_ADDRESS_LOCALHOST;
CORRECT_CHAIN_ID = "0x539"; // 1337
NAME_CHAIN_ID = '#'
OPENSEA_URL = "#";
ETHERSCAN_URL = "#";
}


export const CKNFT_PRICE_IN_ETH = 0.0001;

export const MESSAGE_DELAY_MS = 5000; // add css to show countdown
