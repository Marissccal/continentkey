import { ETHERSCAN_URL } from "../../lib/constants";

const MintProgressNotification = ({ transactionHash }) => {
  return (
    <div className="notification is-primary is-light container has-text-centered custom-reveal-animation is-size-7-mobile">
      <div className="is-flex is-justify-content-center is-align-items-center mb-2">
        <p className="">Awaiting transaction confirmation</p>
        <button className="button is-loading custom-mint-wait-btn"></button>
      </div>
      <p className="mb-4">
        You can view your pending transaction on etherscan here:{" "}
        <a
          className="custom-word-wrap"
          href={`${ETHERSCAN_URL}/tx/${transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          {ETHERSCAN_URL}/tx/{transactionHash}
        </a>
      </p>

      <p>
        It may take a few minutes for your new CKNFT to be processed by the ethereum network. Refreshing the
        page will prevent you from seeing your newly minted Cknft here, but you will be able to view it in the Gallery
        once it has been processed.
      </p>
    </div>
  );
};

export default MintProgressNotification;
