import { expect } from 'chai';
import { ethers } from 'hardhat';
import { utils } from 'ethers';
import { CKNFTTest, CKNFTTest__factory} from '@typechained';
import { evm } from '@utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
require("dotenv").config();

const price = 0.0001;

//const FORK_BLOCK_NUMBER = 11298165;


describe('CKNFT_test', function () {
  // signers
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress; 
  
  // factories
  let cknftFactory: CKNFTTest__factory;  

  // contracts
  let cknft: CKNFTTest;   

  // misc  
  //let snapshotId: string;  

  before(async function () {
    // forking mainnet
    //await evm.reset({
      //jsonRpcUrl: process.env.RPC_ROPSTEN,
      //blockNumber: FORK_BLOCK_NUMBER,
    //});
    // getting signers with ETH
    [, deployer, addr1, addr2, addrs] = await ethers.getSigners();    

    // deploying contracts
    cknftFactory = (await ethers.getContractFactory('CKNFTTest', deployer)) as CKNFTTest__factory;
    cknft = await cknftFactory.deploy();
    
    // snapshot
    //snapshotId = await evm.snapshot.take();
  });
  
  describe('Deployment', function () {
  it("Should set owner of the contract to the deployer address", async function () {
    expect(await cknft.owner()).to.equal(deployer.address);
  });

  it("should set the correct contract uri", async function () {
    expect(await cknft.contractURI()).to.equal(
      process.env.CONTRACT_METADATA_URI
    );
  });

  it("set correct uri", async function () {
    expect(await cknft.uri(0)).to.equal(process.env.URI);
  });

  it("should mint one of each cknft to owner address", async function () {
    for (let i = 0; i < 3; i++) {
      expect(await cknft.balanceOf(deployer.address, i)).to.equal(
        1
      );
    }
  });

  it("should return the correct price", async function () {
    for (let i = 0; i < 3; i++) {
      expect(await cknft.CKNFT_PRICE()).to.equal(
        ethers.utils.parseEther("0.0001")
      );
    }
  });

  it("should return the correct existing supply of a token - OpenSea function", async function () {
    expect(await cknft.totalSupply(0)).to.equal(1);
  });  

  it("Should allow minting of a cknft with correct ether sent", async function () {
    await cknft.connect(deployer).setPaused(false);
    const id = 0;
    const mintTx = await cknft.mint(id, 8, {
      value: ethers.utils.parseEther((price * 8).toString()),
    });
    await mintTx.wait();

    const amountOwned = await cknft.balanceOf(deployer.address, id);
    const amountOwnedInt = parseInt(amountOwned.toString());
    expect(amountOwnedInt).to.equal(9);
  });
  });

  describe('Mint Transactions', function () {

  it("Should revert if incorrect eth sent with mint function", async function () {
    await expect(
      cknft.mint(0, 1, {
        value: ethers.utils.parseEther("0.00011"),
      })
    ).to.be.revertedWith("incorrect ETH");
  });

  it("Should revert if calling mint function above max supply", async function () {
    const id = 0;
    const maxSupplyPlusOne = await cknft.tokenIdToMaxSupplyPlusOne(
      id
    );
    const maxSupplyPlusOneInt = parseInt(maxSupplyPlusOne.toString()) - 1; // 1 already minted to contract owner in constructor
    const eth = price * maxSupplyPlusOneInt;

    await expect(
      cknft.mint(id, maxSupplyPlusOneInt, {
        value: ethers.utils.parseEther(eth.toString()),
      })
    ).to.be.revertedWith("supply exceeded");
  });

  it("Should allow owner to mint with ownerMint", async function () {
    const id = 0;
    const num = 3;
    const mintTx = await cknft.ownerMint(deployer.address, id, num);
    await mintTx.wait();

    const amountOwned = await cknft.balanceOf(deployer.address, id);
    const amountOwnedInt = parseInt(amountOwned.toString());
    expect(amountOwnedInt).to.equal(num + 9);
  });

  it("should revert if non-owner tries to mint with ownerMint", async function () {
    const id = 0;
    const num = 3;

    await expect(
      cknft.connect(addr1).ownerMint(addr1.address, id, num)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if calling ownerMint function above max supply", async function () {
    const id = 0;
    const maxSupplyPlusOne = await cknft.tokenIdToMaxSupplyPlusOne(
      id
    );
    const maxSupplyPlusOneInt = parseInt(maxSupplyPlusOne.toString()); 

    await expect(
      cknft.ownerMint(addr1.address, id, maxSupplyPlusOneInt)
    ).to.be.revertedWith("supply exceeded");
  });

  it("should allow user to mintBatch with correct eth", async function () {
    const ids = [1, 2];
      const amounts = [3, 1];
      const eth = amounts.reduce((prev, curr) => prev + curr, 0) * price;

      const mintTx = await cknft
        .connect(addr1)
        .mintBatch(ids, amounts, {
          value: ethers.utils.parseEther(eth.toString()),
        });
      await mintTx.wait();

      for (let i = 0; i < ids.length; i++) {
        expect(await cknft.balanceOf(addr1.address, ids[i])).to.equal(
          amounts[i]
        );
      }
  });

  it("should revert if user calls mintBatch with incorrect eth", async function () {
    const ids = [1, 2];
    const amounts = [3, 1];
    const eth = amounts.reduce((prev, curr) => prev + curr, 0) * price + 0.01;

    await expect(
      cknft.connect(addr1).mintBatch(ids, amounts, {
        value: ethers.utils.parseEther(eth.toString()),
      })
    ).to.be.revertedWith("incorrect ETH");
  });

  it("should revert if user calls mintBatch above max supply", async function () {
    const ids = [1, 2];
    const amounts = [4, 9999]; // id = 2 has 10000 max supply and 2 already minted to contract owner in constructor
    const totalAmount = amounts.reduce((prev, curr) => prev + curr, 0);
    const eth = (totalAmount * price).toFixed(4);

    await expect(
      cknft.connect(addr1).mintBatch(ids, amounts, {
        value: ethers.utils.parseEther(eth.toString()),
      })
    ).to.be.revertedWith("supply exceeded");
  });

  it("should allow owner to call ownerMintBatch", async function () {
    const ids = [1, 2];
    const amounts = [3, 1];

    const mintTx = await cknft.ownerMintBatch(ids, amounts);
    await mintTx.wait();

    for (let i = 0; i < ids.length; i++) {
      expect(
        await cknft.balanceOf(deployer.address, ids[i])
      ).to.equal(amounts[i] + 1);
    }
  });

  it("should revert if non-owner calls ownerMintBatch", async function () {
    const ids = [1, 2];
    const amounts = [3, 1];

    await expect(
      cknft.connect(addr1).ownerMintBatch(ids, amounts)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should revert if owner calls ownerMintBatch above max supply", async function () {
    const ids = [0, 1, 2];
    const amounts = [9988, 9993, 9997]; // id = 2 has 10000 max supply and 1 already minted to contract owner in constructor

    await expect(
      cknft.ownerMintBatch(ids, amounts)
    ).to.be.revertedWith("supply exceeded");
  });
  });

  describe('Transfer Transactions', function () {

  it("Should allow an address to call safeTransferFrom with a token that it owns and contract should emit event", async function () {
    const id = 2;
    const amount = 2;
    const eth = amount * price;
    const mintTx = await cknft.connect(addr1).mint(id, amount, {
      value: ethers.utils.parseEther(eth.toString()),
    });
    await mintTx.wait();

    const transferTx = await cknft
      .connect(addr1)
      .safeTransferFrom(addr1.address, deployer.address, id, 1, "0x00");
    await transferTx.wait();

    expect(await cknft.balanceOf(deployer.address, id)).to.equal(3);

    // emit event
    await expect(
      cknft
        .connect(addr1)
        .safeTransferFrom(addr1.address, deployer.address, id, 1, "0x00")
    )
      .to.emit(cknft, "TransferSingle")
      .withArgs(addr1.address, addr1.address, deployer.address, id, 1);
  });

  it("Should revert if an address calls safeTransferFrom with a token it does not own", async function () {
    const id = 2;
    const amount = 2;
    const eth = amount * price;
    const mintTx = await cknft.connect(addr1).mint(id, amount, {
      value: ethers.utils.parseEther(eth.toString()),
    });
    await mintTx.wait();

    await expect(
      cknft.safeTransferFrom(
        addr1.address,
        deployer.address,
        id,
        1,
        "0x00"
      )
    ).to.be.revertedWith("ERC1155: caller is not owner nor approved");
  });

  it("Should allow an address to call safeBatchTransferFrom with tokens that it owns and contract should emit event", async function () {
    let ids = [1, 2];
    let amounts = [1, 1];
    // already minted to contract owner in constructor    

    const transferTx = await cknft.safeBatchTransferFrom(
      deployer.address,
      addr2.address,
      ids,
      amounts,
      "0x00"
    );
    await transferTx.wait();

    for (let i = 0; i < ids.length; i++) {
      expect(await cknft.balanceOf(addr2.address, ids[i])).to.equal(
        amounts[i] 
      );
    }

    // emit event
    ids = [1, 2];
    amounts = [1, 1];
    await expect(
      cknft.safeBatchTransferFrom(
        deployer.address,
        addr2.address,
        ids,
        amounts,
        "0x00"
      )
    )
      .to.emit(cknft, "TransferBatch")
      .withArgs(
        deployer.address,
        deployer.address,
        addr2.address,
        ids,
        amounts
      );
  });

  it("Should revert if an address calls safeBatchTransferFrom with tokens it does not own", async function () {
    let ids = [0, 1];
    let amounts = [1, 1];
    // already minted 1 of each to contract owner in constructor
    await expect(
      cknft
        .connect(addr1)
        .safeBatchTransferFrom(
          addr1.address,
          deployer.address,
          ids,
          amounts,
          "0x00"
        )
    ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
  });

  it("should return correct contract uri after calling setContractURI", async function () {
    const newURIString = "ipfs://newURI";
    await cknft.setContractURI(newURIString);

    expect(await cknft.contractURI()).to.equal(newURIString);
  });

  it("should revert if non-owner calls setContractURI", async function () {
    const newURIString = "ipfs://newURI";

    await expect(
      cknft.connect(addr1).setContractURI(newURIString)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });  

  it("Should allow owner to withdraw funds", async function () {
    const provider = ethers.provider;

    const ids = [1, 2];
    const amounts = [3, 1];
    const eth = amounts.reduce((prev, curr) => prev + curr, 0) * price;

    const mintTx = await cknft
      .connect(addr1)
      .mintBatch(ids, amounts, {
        value: ethers.utils.parseEther(eth.toString()),
      });
    await mintTx.wait();

    const beforeBalance = await provider.getBalance(deployer.address);

    const withdrawTx = await cknft.withdraw();
    await withdrawTx.wait();

    const afterBalance = await provider.getBalance(deployer.address);

    expect(parseFloat(afterBalance.toString())).to.be.greaterThan(
      parseFloat(beforeBalance.toString())
    );
  });

  it("should revert if non-owner tries to withdraw funds", async function () {
    await expect(
      cknft.connect(addr1).withdraw()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });  
  });

});

