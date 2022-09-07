import { useState } from "react";
import { useMoralis } from "react-moralis";

import {cknftInfo1} from "../../lib/cknftInfo1";

import MintCard from "../cknftCard/MintCard";
import MintModal from "./MintModal";
//import { CKNFT_ADDRESS, ETHERSCAN_URL } from "../../lib/constants";
import BatchMintModal from "./BatchMintModal";

const Mint = (props) => {
  const {
    setShowWalletModal,
    showMintModal,
    setShowMintModal,
    walletWaitingOnUser,
    awaitingBlockConfirmation,
    awaitingNewlyMintedCknft,
    transactionHash,
    existingCknftSupply,
    mint,
  } = props;

  const { isWeb3Enabled } = useMoralis();

  const [selectedCknft, setSelectedCknft] = useState(null);
  const [showBatchMintInfo, setShowBatchMintInfo] = useState(false);

  return (
    <>
      {showBatchMintInfo && <BatchMintModal handleClose={() => setShowBatchMintInfo(false)} />}

      {showMintModal && (
        <MintModal
          CKNFT={cknftInfo1[selectedCknft]}
          numAlreadyMinted={existingCknftSupply[selectedCknft]}
          mint={mint}
          walletWaitingOnUser={walletWaitingOnUser}
          awaitingBlockConfirmation={awaitingBlockConfirmation}
          awaitingNewlyMintedCknft={awaitingNewlyMintedCknft}
          transactionHash={transactionHash}
          handleClose={() => setShowMintModal(false)}
        />
      )}
      <div className="background">
        <section className="section pt-3 has-text-centered">
          <h1 className="subtitle custom-mobile-subtitle mb-2">MINT</h1>
          <h2 className="subtitle custom-mobile-subtitle mb-2">
            Mint your NFT here! Each Cknft costs 0.0001 ETH + gas.
          </h2>
          {}
          <p className="custom-smaller-mobile-text mb-5">
            
          </p>
          {!isWeb3Enabled && (
            <button className="button mb-5" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </button>
          )}

          <div className="custom-mint-card-div">
            {cknftInfo1.map((CKNFT, index) => (
              <MintCard
                key={index}
                CKNFT={CKNFT}
                existingCKNFTSupply={existingCknftSupply}
                setSelectedCknft={setSelectedCknft}
                setShowMintModal={setShowMintModal}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Mint;
