const CKNFT_ADDRESS_LOCALHOST = "";
const CKNFT_ADDRESS_RINKEBY = "0x5DB7a3f1afE12Dee83f5A8Bf747A9D6f045F3D91";
const CKNFT_ADDRESS_MAINNET = "";
const CKNFT_ADDRESS_GOERLI = "";
const CKNFT_ADDRESS_POLYGON = "";

const deploymentOptions = [
  "localhost",
  "goerli",
  "mainnet",
  "rinkeby",
  "polygon",
];
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
  NAME_CHAIN_ID = "matic";
  OPENSEA_URL = "https://opensea.io";
  ETHERSCAN_URL = "https://polygonscan.com";
} else if (DEPLOY_TO === deploymentOptions[1]) {
  // rinkeby
  CKNFT_ADDRESS = CKNFT_ADDRESS_RINKEBY;
  CORRECT_CHAIN_ID = "0x4"; // 4
  NAME_CHAIN_ID = "rinkeby";
  OPENSEA_URL = "https://testnets.opensea.io";
  ETHERSCAN_URL = "https://rinkeby.etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[2]) {
  // mainnet
  CKNFT_ADDRESS = CKNFT_ADDRESS_MAINNET;
  CORRECT_CHAIN_ID = "0x1"; // 1
  NAME_CHAIN_ID = "ethereum";
  OPENSEA_URL = "https://opensea.io";
  ETHERSCAN_URL = "https://etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[3]) {
  // goerli
  CKNFT_ADDRESS = CKNFT_ADDRESS_GOERLI;
  CORRECT_CHAIN_ID = "0x5"; // 5
  NAME_CHAIN_ID = "goerli";
  OPENSEA_URL = "https://testnets.opensea.io";
  ETHERSCAN_URL = "https://goerli.etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[4]) {
  // localhost
  CKNFT_ADDRESS = CKNFT_ADDRESS_LOCALHOST;
  CORRECT_CHAIN_ID = "0x539"; // 1337
  NAME_CHAIN_ID = "#";
  OPENSEA_URL = "#";
  ETHERSCAN_URL = "#";
}

export const CKNFT_PRICE_IN_ETH = 0.0001;

export const MESSAGE_DELAY_MS = 5000; // add css to show countdown
