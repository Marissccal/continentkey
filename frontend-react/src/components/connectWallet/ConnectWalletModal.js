import React from "react";

import logo2 from "../../img/Logo2.png";
import walletConnectImg from "../../img/wallet-connect.png";
import ConnectButton from "./ConnectButton";

const ConnectWalletModal = ({
  showWalletModal,
  isMetamaskLoading,
  handleConnectMetaMask,
  isMetamaskInstalled,
  isWalletConnectLoading,
  handleWalletConnect,
  handleClose,
}) => {
  return (
    <>
      <div id="modal" className="modal is-active">
        <div className="modal-background" onClick={handleClose}></div>
        {/* <div className="modal-content custom-reveal-animation"> */}
        <div className={`modal-content custom-reveal-animation`}>
          <div className="box has-text-centered">
            <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
            <p className="is-size-2">Connect a Wallet</p>
            <div className="custom-wallet-btns-div mt-0 pt-3 pb-4">
              <ConnectButton
                isLoading={isMetamaskLoading}
                connectWalletHandler={handleConnectMetaMask}
                logo={logo2}
                text={"Connect With MetaMask"}
                isDisabled={isMetamaskInstalled}
              />
              {/* 
              <ConnectButton
                isLoading={isWalletConnectLoading}
                connectWalletHandler={handleWalletConnect}
                logo={walletConnectImg}
                text={"Wallet Connect"}
              /> */}
              <p>Desktop only. More options coming soon...</p>
            </div>
            <a
              className=""
              href="https://learn.rainbow.me/what-is-a-cryptoweb3-wallet-actually"
              target="_blank"
              rel="noreferrer"
            >
              What is a Wallet?
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectWalletModal;
