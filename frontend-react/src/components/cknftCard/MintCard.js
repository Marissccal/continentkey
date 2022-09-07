import { useMoralis } from "react-moralis";

import Logo from "../../img/Logo.png";
import CknftAttribute from "./CknftAttribute";

import { CORRECT_CHAIN_ID, NAME_CHAIN_ID, CKNFT_ADDRESS, OPENSEA_URL } from "../../lib/constants";

const MintCard = ({ CKNFT, existingCKNFTSupply, setSelectedCknft, setShowMintModal }) => {
  const style = { backgroundColor: `#${CKNFT.metadata.background_color}` };

  const { isWeb3Enabled, chainId } = useMoralis();

  function handleMintClick() {
    if (!isWeb3Enabled) return;
    setSelectedCknft(CKNFT.tokenId);
    setShowMintModal(true);
  }

  return (
    <>
      <div className={`card custom-card`}>
        <div className={`card-image`}>
          <figure
            style={style}
            className={`image is-4by4 ${
              existingCKNFTSupply && existingCKNFTSupply[CKNFT.tokenId] - CKNFT.maxSupply === 0
                ? "custom-sold-out"
                : ""
            }`}
          >
            <img src={CKNFT.image} />
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
              <p className="title is-4 mb-0 is-capitalized">{CKNFT.metadata.name}</p>
              <p className="">{`Token ID: ${CKNFT.tokenId}`}</p>
            </div>
          </div>

          <p className="has-text-left mt-0 mb-3 is-size-7">{CKNFT.metadata.description}</p>

          <div className="content field is-grouped is-flex">
            <CknftAttribute metadata={CKNFT.metadata} traitNum={0} />
            <CknftAttribute metadata={CKNFT.metadata} traitNum={1} />
            <CknftAttribute metadata={CKNFT.metadata} traitNum={2} />            
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
