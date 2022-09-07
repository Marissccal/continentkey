import { useMoralis } from "react-moralis";
import GettingUserCknftNotification from "../alerts/GettingUserCKNFTNotification";

import NoCknftNotification from "../alerts/NoCKNFTNotification";
import CknftCard from "../cknftCard/CknftCard";

const Gallery = (props) => {
  const { setShowWalletModal, getOwnerCknft, gettingUserCknft, userCknftDetails, showNoCknftNotification } =
    props;

  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="background">
      <section className="section pt-3 has-text-centered">
        <h1 className="subtitle custom-mobile-subtitle mb-5">YOUR CKNFT GALLERY</h1>        

        {!isWeb3Enabled && (
          <button className="button mb-5" onClick={() => setShowWalletModal(true)}>
            Connect Wallet
          </button>
        )}

        <div>
          {isWeb3Enabled && (
            <button className={`button mb-5 ${gettingUserCknft ? "is-loading" : ""}`} onClick={getOwnerCknft}>
              {userCknftDetails.length === 0 ? "See Your CKNFT" : "Refresh Your CKNFT"}
            </button>
          )}
        </div>

        {gettingUserCknft && <GettingUserCknftNotification />}

        {userCknftDetails.length > 0 && (
          <div className="custom-mint-card-div">
            {userCknftDetails.map((CKNFT, index) => (
              <CknftCard key={index} cknftDetails={CKNFT} />
            ))}
          </div>
        )}

        {isWeb3Enabled && showNoCknftNotification && <NoCknftNotification />}
      </section>
    </div>
  );
};

export default Gallery;
