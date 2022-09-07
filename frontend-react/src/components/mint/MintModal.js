import React, { useState } from "react";

import WalletOpenMessage from "../alerts/WalletOpenMessage";
import MintProgressNotification from "../alerts/MintProgressNotification";
import GettingNewlyMintedCknft from "../alerts/GettingNewlyMintedCknft";

import { CKNFT_PRICE_IN_ETH } from "../../lib/constants";

const MintModal = ({
  CKNFT,
  numAlreadyMinted,
  handleClose,
  mint,
  walletWaitingOnUser,
  awaitingBlockConfirmation,
  awaitingNewlyMintedCknft,
  transactionHash,
}) => {
  const style = { backgroundColor: `#${CKNFT.metadata.background_color}` };

  const [counter, setCounter] = useState(0);

  function handleDecreaseCount() {
    if (counter === 0) return;
    setCounter((prev) => prev - 1);
  }

  function handleIncreaseCount() {
    if (counter === CKNFT.maxSupply - numAlreadyMinted) return;
    setCounter((prev) => prev + 1);
  }

  function closeModal() {
    if (walletWaitingOnUser || awaitingBlockConfirmation) return;
    handleClose();
  }

  return (
    <>
      <div id="modal" className="modal is-active">
        <div className="modal-background" onClick={closeModal}></div>
        <div className="modal-content custom-reveal-animation ">
          <div className="box " style={style}>
            <div className="has-text-centered">
              <p className="is-size-2 is-size-4-mobile">
                <span className="is-capitalized">{CKNFT.metadata.attributes[1].value}</span> the{" "}
                <span className="is-capitalized">{CKNFT.metadata.name}</span>
              </p>
              <p>
                {numAlreadyMinted} / {CKNFT.maxSupply} already minted
              </p>
            </div>
            <img className="custom-mint-modal-image" src={CKNFT.image}></img>
            <div className="is-flex is-flex-direction-column is-align-items-center">
              <div className="is-flex is-justify-content-center is-align-items-center">
                <button
                  className="button custom-counter-btn"
                  disabled={walletWaitingOnUser || awaitingBlockConfirmation}
                  onClick={handleDecreaseCount}
                >
                  ▼
                </button>
                <span className="is-size-3 pl-4 pr-4">{counter}</span>
                <button
                  className="button custom-counter-btn"
                  disabled={walletWaitingOnUser || awaitingBlockConfirmation}
                  onClick={handleIncreaseCount}
                >
                  ▲
                </button>
              </div>
              <p>Cost to Mint: {CKNFT_PRICE_IN_ETH * counter} + gas</p>
              <button
                className="button mt-4"
                disabled={counter === 0 || walletWaitingOnUser || awaitingBlockConfirmation}
                onClick={() => mint(CKNFT.tokenId, counter)}
              >
                MINT
              </button>
            </div>
          </div>
          {walletWaitingOnUser && (
            <div className="custom-wallet-minting">
              <WalletOpenMessage />
            </div>
          )}
          {awaitingBlockConfirmation && (
            <div className="custom-wallet-minting">
              <MintProgressNotification
                awaitingBlockConfirmation={awaitingBlockConfirmation}
                transactionHash={transactionHash}
              />
            </div>
          )}
          {awaitingNewlyMintedCknft && (
            <div className="custom-wallet-minting">
              <GettingNewlyMintedCknft />
            </div>
          )}
        </div>
        <button
          className={`modal-close is-large ${awaitingBlockConfirmation ? "custom-hidden" : ""}`}
          aria-label="close"
          onClick={closeModal}
        ></button>
      </div>
    </>
  );
};

export default MintModal;
