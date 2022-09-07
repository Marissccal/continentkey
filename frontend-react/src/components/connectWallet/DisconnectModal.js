import React from "react";
import { useMoralis } from "react-moralis";
import delay from "../../lib/delay";

const DisconnectModal = ({ handleClose }) => {
  const { isWeb3Enabled, chainId, account, Moralis } = useMoralis();

  async function handleDisconnect() {
    Moralis.deactivateWeb3();
    await delay(1500);
    handleClose();
  }

  return (
    <>
      <div id="modal" className="modal is-active">
        <div className="modal-background" onClick={handleClose}></div>
        <div className="modal-content custom-reveal-animation">
          <div className="box has-text-centered">
            <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
            <p className="is-size-2">{isWeb3Enabled ? "Currently Connected" : "Disconnected Successfully"}</p>
            <div className="is-size-5 mt-2">
              <p>Network ID: {isWeb3Enabled && parseInt(chainId)}</p>
              <p>Account: {isWeb3Enabled && account}</p>
              <button className="button mt-4 mb-2" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisconnectModal;
