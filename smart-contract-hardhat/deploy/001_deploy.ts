import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { shouldVerifyContract } from 'utils/deploy';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const currentNonce: number = await ethers.provider.getTransactionCount(deployer);

  
  const cknft = await hre.deployments.deploy('CKNFT', {
    contract: 'solidity/contracts/CKNFT.sol:CKNFT',
    from: deployer,
    //args: cknftHelperArgs,
    log: true,
  });

  /*if (hre.network.name !== 'hardhat' && (await shouldVerifyContract(cknft))) {
    await hre.run('verify:verify', {
      address: cknft.address,
      //constructorArguments: cknftHelperArgs,
    });
  }*/
};

deployFunction.tags = ['CKNFT', 'testnet'];

export default deployFunction;
