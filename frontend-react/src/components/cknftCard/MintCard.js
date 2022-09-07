import { useMoralis } from "react-moralis";
//import styled from "styled-components";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import Logo from "../../img/Logo.png";
import CknftAttribute from "./CknftAttribute";

import { CORRECT_CHAIN_ID, NAME_CHAIN_ID, CKNFT_ADDRESS, OPENSEA_URL } from "../../lib/constants";

const MintCard = ({ CKNFT, existingCKNFTSupply, setSelectedCknft, setShowMintModal }) => {
  //const style = { backgroundColor: `#${CKNFT.metadata1.background_color}` };

  const { isWeb3Enabled, chainId } = useMoralis();

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };  

  function handleMintClick() {
    if (!isWeb3Enabled) return;
    setSelectedCknft(CKNFT.tokenId);
    setShowMintModal(true);
  }

  return (
    <>
      <div className={`card custom-card`}>
        <div className={`card-image`}>
          <figure>            
            <img               
              className={`video-thumb tiny ${
                existingCKNFTSupply && existingCKNFTSupply[CKNFT.tokenId] - CKNFT.maxSupply === 0
                  ? "custom-sold-out"
                  : ""
              }`}
              alt="thumb"
              style={{ opacity: isVideoLoaded ? 0 : 1 }}
            />
            <div style={{ opacity: isVideoLoaded ? 1 : 0 }}>
              <ReactPlayer
                url={CKNFT.image1}
                playing={true}
                controls={true}
                loop={true}
                muted={true}
                playsinline={true}
                onReady={onLoadedData}
              />
            </div>            
          </figure>
          {isWeb3Enabled &&
            chainId === CORRECT_CHAIN_ID &&
            (existingCKNFTSupply ? (
              <button
                className="button custom-mint-button"
                disabled={existingCKNFTSupply[CKNFT.tokenId] - CKNFT.maxSupply === 0}
                onClick={handleMintClick}
              >
                {existingCKNFTSupply[CKNFT.tokenId] - CKNFT.maxSupply === 0 ? "sold out" : "mint me"}
              </button>
            ) : (
              <button className="button custom-mint-button is-loading">loading...</button>
            ))}

          {!isWeb3Enabled && <p className="custom-num-minted">connect to see availability and mint</p>}

          {isWeb3Enabled &&
            (chainId !== CORRECT_CHAIN_ID ? (
              <p className="custom-num-minted">connect to see availability and mint</p>
            ) : existingCKNFTSupply ? (
              <p className="custom-num-minted">
                {existingCKNFTSupply[CKNFT.tokenId]} / {CKNFT.maxSupply} minted
              </p>
            ) : (
              <p className="custom-num-minted">loading...</p>
            ))}
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="CKNFT Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">{CKNFT.metadata1.name}</p>
              <p className="">{`Token ID: ${CKNFT.tokenId}`}</p>
            </div>
          </div>

          <p className="has-text-left mt-0 mb-3 is-size-7">{CKNFT.metadata1.description}</p>

          <div className="content field is-grouped is-flex">
            <CknftAttribute metadata1={CKNFT.metadata1} traitNum={0} />
            <CknftAttribute metadata1={CKNFT.metadata1} traitNum={1} />
            <CknftAttribute metadata1={CKNFT.metadata1} traitNum={2} />            
          </div>
          <a
            href={`${OPENSEA_URL}/assets/${NAME_CHAIN_ID}/${CKNFT_ADDRESS}/${CKNFT.tokenId}`}
            target="_blank"
            rel="no-referrer"
            className="custom-opensea-link"
          >
            view on opensea
          </a>
        </div>
      </div>      
    </>
  );
};


export default MintCard;

