import Logo from "../../img/Logo.png";
import CknftAttribute from "./CknftAttribute";

import cknft_0Img from "../../img/cknft_img/cknft-0.png";
import cknft_1Img from "../../img/cknft_img/Continent_maqueta_.mp4";

import {
  CKNFT_ADDRESS,
  CORRECT_CHAIN_ID,
  NAME_CHAIN_ID,
  OPENSEA_URL,
} from "../../lib/constants";

const fallBackImages = [
  {
    image: cknft_0Img,
  },
  {
    video: cknft_1Img,
  },
];

const CknftCard = ({ cknftDetails }) => {
  const imgURI = `https://gateway.pinata.cloud/ipfs/${cknftDetails.uriJSON.image
    .split("")
    .splice(7)
    .join("")}`;
  const style = { backgroundColor: "black", border: "thick solid #000" };

  return (
    <>
      <div className="card custom-card">
        <div className="card-image">
          <figure style={style} className="image is-3by4">
            {/*onError in case ipfs img url does not work */}
            <img
              src={imgURI}
              className="custom-mint-modal-img"
              /*               onerror={(e) => {
                e.target.onerror = null;
                e.target.src = fallBackImages[cknftDetails.uriJSON.name];
              }} */
            />
            <video
              className="custom-mint-modal-video2"
              src={imgURI}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallBackImages[cknftDetails.uriJSON.name];
              }}
              autoPlay={true}
              loop
              /* controls */
              muted
            />
          </figure>
          <p className="custom-num-minted">You own {cknftDetails.amount}</p>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="cknft Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">
                {cknftDetails.uriJSON.name}
              </p>
              <p className="">{`Token ID: ${cknftDetails.tokenId}`}</p>
            </div>
          </div>

          <p className="has-text-left mt-0 mb-3 is-size-7">
            {cknftDetails.uriJSON.description}
          </p>
          <div className="content field is-grouped is-flex">
            <CknftAttribute metadata={cknftDetails.uriJSON} traitNum={0} />
            <CknftAttribute metadata={cknftDetails.uriJSON} traitNum={1} />
            <CknftAttribute metadata={cknftDetails.uriJSON} traitNum={2} />
          </div>
          <a
            href={`${OPENSEA_URL}/assets/${NAME_CHAIN_ID}/${CKNFT_ADDRESS}/${cknftDetails.tokenId}`}
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

export default CknftCard;
