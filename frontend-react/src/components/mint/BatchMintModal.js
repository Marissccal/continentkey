import React from "react";

import { ETHERSCAN_URL, CKNFT_ADDRESS } from "../../lib/constants";

const BatchMintModal = ({ handleClose }) => {
  return (
    <>
      <div id="modal" className="modal is-active">
        <div className="modal-background" onClick={handleClose}></div>
        <div className={`modal-content custom-reveal-animation`}>
          <div className="box has-text-centered">
            <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
            <p className="is-size-2 pb-3">Batch Minting</p>
            <p className="custom-smaller-mobile-text pb-3">
              <span>
                
              </span>
              <a href={`${ETHERSCAN_URL}/address/${CKNFT_ADDRESS}`} target="_blank" rel="no-referrer">
                here
              </a>
              <span>
                . This is more gas efficient when 5 or more <strong>different</strong> CKNFT are minted at once.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchMintModal;
