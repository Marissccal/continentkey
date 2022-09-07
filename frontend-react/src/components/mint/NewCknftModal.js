import React from "react";
import CknftCard from "../cknftCard/CknftCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const NewCknftModal = ({ mintedCknftDetails, transactionHash, handleClose }) => {
  return (
    <>
      <div id="modal" className="modal is-active">
        <div className="modal-background" onClick={handleClose}></div>
        <div className="modal-content custom-reveal-animation ">
          <div className="box is-flex is-justify-content-center ">
            <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center new-CKNFT-background custom-new-CKNFT-mobile">
              <p className="is-size-4 is-uppercase mb-2 is-hidden-mobile">
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3  " icon={faStar} /> a new CKNFT is born!{" "}
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3 " icon={faStar} />
              </p>
              <CknftCard cknftDetails={mintedCknftDetails} />
              <p className="is-size-7 pt-3 is-hidden-mobile">Transaction Hash:</p>
              <p className="is-size-7 is-hidden-mobile">{transactionHash}</p>
            </div>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
      </div>
    </>
  );
};

export default NewCknftModal;
