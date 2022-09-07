import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

import "bulma/css/bulma.css";
import "./App.css";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Mint from "./components/mint/Mint";
import Gallery from "./components/gallery/Gallery";
import ConnectWalletModal from "./components/connectWallet/ConnectWalletModal";
import DisconnectModal from "./components/connectWallet/DisconnectModal";
import NewCknftModal from "./components/mint/NewCknftModal";
import AccountChangedWarning from "./components/alerts/AccountChangedWarning";
import WrongChainWarning from "./components/alerts/WrongChainWarning";
import ErrorMessage from "./components/alerts/ErrorMessage";

import { CORRECT_CHAIN_ID, CKNFT_ADDRESS, MESSAGE_DELAY_MS, CKNFT_PRICE_IN_ETH } from "./lib/constants";
import range from "./lib/range";
import delay from "./lib/delay";

import CKNFT from "./contracts/CKNFT.json";

function App() {
  const { enableWeb3, isWeb3Enabled, chainId, account, Moralis } = useMoralis();

  const [selectedTab, setSelectedTab] = useState("About");

  // wallet loading state
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [isMetamaskLoading, setIsMetamaskLoading] = useState(false);
  const [isWalletConnectLoading, setIsWalletConnectLoading] = useState(false);

  // minting state
  const [showMintModal, setShowMintModal] = useState(false);
  const [showNewCknftModal, setShowNewCknftModal] = useState(false);
  const [existingCknftSupply, setExistingCknftSupply] = useState(null);
  const [walletWaitingOnUser, setWalletWaitingOnUser] = useState(false);
  const [awaitingBlockConfirmation, setAwaitingBlockConfirmation] = useState(false);
  const [awaitingNewlyMintedCknft, setAwaitingNewlyMintedCknft] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [mintedCknftDetails, setMintedCknftDetails] = useState(null);

  // gallery state
  const [gettingUserCknft, setGettingUserCknft] = useState(false);
  const [userCknftDetails, setUserCknftDetails] = useState([]);
  const [showNoCknftNotification, setShowNoCknftNotification] = useState(false);

  // warning and error state
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [showAccountChangedWarning, setShowAccountChangedWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check for metamask on page load
  useEffect(() => {
    if (!window.ethereum) {
      console.log("no metamask detected");
      setIsMetamaskInstalled(true);
    }
  }, []);

  async function handleConnectMetaMask() {
    try {
      setIsMetamaskLoading(true);
      const web3Provider = await enableWeb3();
      console.log(web3Provider);
      setIsMetamaskLoading(false);

      await delay(1500); // allows user to see that they are connected
      setShowWalletModal(false);
    } catch (error) {
      console.log(error);
      setIsMetamaskLoading(false);
      setErrorMessage(error);
    }
  }

  async function handleWalletConnect() {
    try {
      setIsWalletConnectLoading(true);
      const web3Provider = enableWeb3({
        provider: "walletconnect",
        mobileLinks: ["rainbow", "metamask"],
      });
      console.log(web3Provider);
      setIsWalletConnectLoading(false);
      setShowWalletModal(false);
    } catch (error) {
      setIsWalletConnectLoading(false);
      setErrorMessage(error);
    }
  }

  // update existing supply of each token when user connects wallet
  useEffect(() => {
    if (!isWeb3Enabled) return;
    if (chainId !== CORRECT_CHAIN_ID) return;
    getExistingTokenSupply();
  }, [isWeb3Enabled, chainId]);

  async function getExistingTokenSupply() {
    try {
      const options = {
        contractAddress: CKNFT_ADDRESS,
        abi: CKNFT.abi,
      };

      let existingSupply = [];
      for await (const cknft of range(0, 20)) {
        const numMinted = await Moralis.executeFunction({
          ...options,
          functionName: "tokenIdToExistingSupply",
          params: { "": cknft },
        });
        existingSupply.push(numMinted.toString());
      }
      setExistingCknftSupply(existingSupply);
    } catch (error) {
      console.log(error);
      setErrorMessage(error);
    }
  }

  // listen for EIP-1193 events
  useEffect(() => {
    // Other events: onWeb3Enabled, onDisconnect

    Moralis.onChainChanged((result) => {
      console.log(result);
      setUserCknftDetails([]);
      clearErrorMessages();
    });

    Moralis.onWeb3Deactivated((result) => {
      // console.log(result);
      setUserCknftDetails([]);
      clearErrorMessages();
    });

    Moralis.onAccountChanged((result) => {
      // console.log(result);
      setUserCknftDetails([]);
      clearErrorMessages();
      setShowAccountChangedWarning(true);
      setTimeout(() => {
        setShowAccountChangedWarning(false);
      }, MESSAGE_DELAY_MS);
    });
  });

  async function fetchMetadata(uri) {
    try {
      const response = await fetch(uri);

      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function mint(id, numCknft) {
    try {
      const ethToPay = CKNFT_PRICE_IN_ETH * numCknft; // to fixed?

      const options = {
        contractAddress: CKNFT_ADDRESS,
        abi: CKNFT.abi,
      };

      setWalletWaitingOnUser(true);
      const mintTx = await Moralis.executeFunction({
        ...options,
        functionName: "mint",
        params: { _id: id, _amount: numCknft },
        msgValue: ethers.utils.parseEther(ethToPay.toString()),
      });
      setWalletWaitingOnUser(false);
      setTransactionHash(mintTx.hash);

      setAwaitingBlockConfirmation(true);
      // await delay(10000); // delete for production
      const mintTxReceipt = await mintTx.wait();
      await getExistingTokenSupply(); // update existing supply on mint page
      setAwaitingBlockConfirmation(false);

      // TODO - show fetching notification!
      setAwaitingNewlyMintedCknft(true);
      //console.log(mintTxReceipt);
      const tokenId = mintTxReceipt.events[0].args[3];
      //console.log(tokenId.toString());
      //console.log(`you minted ${numCknft} of token Id ${id}`);

      // store newly minted CKNFT details to state
      const tokenUri = await Moralis.executeFunction({
        ...options,
        functionName: "uri",
        params: { "": tokenId.toString() },
      });

      const tokenUriHttps = `https://${tokenUri.split("").splice(7).join("")}`;
      const uri = tokenUriHttps.replace("{id}", `${parseInt(tokenId).toString(16).padStart(0, "0")}`);
      const uriJSON = await fetchMetadata(uri);

      const amountOwned = await Moralis.executeFunction({
        ...options,
        functionName: "balanceOf",
        params: {
          account: account,
          id: parseInt(tokenId.toString()),
        },
      });
      const amountOwnedInt = parseInt(amountOwned.toString());

      setMintedCknftDetails({ tokenId: parseInt(tokenId.toString()), amount: amountOwnedInt, uriJSON });

      setShowMintModal(false);
      setAwaitingNewlyMintedCknft(false);
      setShowNewCknftModal(true);
    } catch (error) {
      clearErrorMessages();
      setErrorMessage(error);
    }
  }

  // TODO - separate from mint function
  async function renderNewlyMintedCknft() {
    console.log("rendering");
    try {
    } catch (error) {}
  }

  async function getOwnerCknft() {
    try {
      // useMoralis() includes account and provider
      setGettingUserCknft(true);

      const options = {
        contractAddress: CKNFT_ADDRESS,
        abi: CKNFT.abi,
      };

      const baseURI = await Moralis.executeFunction({
        ...options,
        functionName: "uri",
        params: { "": "0" },
      });

      let ownerCknft = [];
      for await (const cknft of range(0, 20)) {
        const numCknft = await Moralis.executeFunction({
          ...options,
          functionName: "balanceOf",
          params: {
            account: account,
            id: cknft,
          },
        });
        const numCknftInt = parseInt(numCknft.toString());
        console.log(numCknft.toString());

        // get token uri
        if (numCknftInt > 0) {
          const uri = `https://${baseURI
            .split("")
            .splice(7)
            .join("")
            .replace("{id}", cknft.toString(16).padStart(0, "0"))}`;

          const uriJSON = await fetchMetadata(uri);

          ownerCknft.push({ tokenId: cknft, amount: numCknftInt, uriJSON });
        }
      }

      setUserCknftDetails(ownerCknft);
      if (ownerCknft.length === 0) setShowNoCknftNotification(true);
      setGettingUserCknft(false);
    } catch (error) {
      setGettingUserCknft(false);
      clearErrorMessages();
      setErrorMessage(error);
    }
  }

  function clearErrorMessages() {
    setErrorMessage(null);
    setShowNoCknftNotification(false);
    setWalletWaitingOnUser(false);
    setAwaitingBlockConfirmation(false);
  }

  useEffect(() => {
    clearErrorMessages();
  }, [selectedTab]);

  return (
    <>
      <Navbar
        setSelectedTab={setSelectedTab}
        setShowWalletModal={setShowWalletModal}
        setShowDisconnectModal={setShowDisconnectModal}
      />

      {/* start of modals and notifications */}
      {isWeb3Enabled && chainId !== CORRECT_CHAIN_ID && <WrongChainWarning />}
      {showAccountChangedWarning && <AccountChangedWarning />}
      {errorMessage && <ErrorMessage errorMessage={errorMessage} setErrorMessage={setErrorMessage} />}
      {showWalletModal && (
        <ConnectWalletModal
          showWalletModal={showWalletModal}
          isMetamaskInstalled={isMetamaskInstalled}
          isMetamaskLoading={isMetamaskLoading}
          isWalletConnectLoading={isWalletConnectLoading}
          handleConnectMetaMask={handleConnectMetaMask}
          handleWalletConnect={handleWalletConnect}
          handleClose={() => setShowWalletModal(false)}
        />
      )}
      {showDisconnectModal && <DisconnectModal handleClose={() => setShowDisconnectModal(false)} />}

      {showNewCknftModal && (
        <NewCknftModal
          mintedCknftDetails={mintedCknftDetails}
          transactionHash={transactionHash}
          handleClose={() => setShowNewCknftModal(false)}
        />
      )}
      {/* end of modals and notifications */}

      
      {selectedTab === "Mint" && (
        <Mint
          setShowWalletModal={setShowWalletModal}
          showMintModal={showMintModal}
          setShowMintModal={setShowMintModal}
          walletWaitingOnUser={walletWaitingOnUser}
          awaitingBlockConfirmation={awaitingBlockConfirmation}
          awaitingNewlyMintedCknft={awaitingNewlyMintedCknft}
          transactionHash={transactionHash}
          existingCknftSupply={existingCknftSupply}
          mint={mint}
        />
      )}
      {selectedTab === "Gallery" && (
        <Gallery
          setShowWalletModal={setShowWalletModal}
          getOwnerCknft={getOwnerCknft}
          gettingUserCknft={gettingUserCknft}
          userCknftDetails={userCknftDetails}
          showNoCknftNotification={showNoCknftNotification}
        />
      )}
    </>
  );
}

export default App;
