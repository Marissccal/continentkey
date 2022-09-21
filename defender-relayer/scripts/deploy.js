const { ethers } = require("hardhat");
const hre = require("hardhat")
const {DefenderRelayProvider, DefenderRelaySigner} = require("defender-relay-client/lib/ethers");
require("dotenv").config();


async function main() {
  const credentials = { 
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast"
  });

  const cknft = await ethers.getContractFactory("CKNFT");
  const relayer = await cknft.connect(signer).deploy();

  await relayer.deployed();

  console.log(
    "The CNFT Token contract address is:",
    relayer.address
  );  

  await hre.run("verify:verify", {
    address: relayer.address,
    //contract: "contracts/CFNFT.sol:CKNFT", //Filename.sol:ClassName
  //constructorArguments: [arg1, arg2, arg3],
  })
};

main()
  .then(() => process.getMaxListeners(0))
  .catch((error) => {
    console.error(error);
    process.getMaxListeners(1);
  });




