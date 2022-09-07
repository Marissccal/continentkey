import { useMoralis } from "react-moralis";

const ConnectButton = ({ connectWalletHandler, logo, text, isDisabled, isLoading }) => {
  const { isWeb3Enabled } = useMoralis();

  return (
    <>
      <button
        className={`button custom-connect-btn p-6 ${isLoading ? "is-loading" : ""}`}
        onClick={connectWalletHandler}
        disabled={isDisabled}
      >
        <figure className="image is-96x96 mr-2 custom-mobile-metamask-fox">
          <img src={logo} alt="" />
        </figure>
        <span className="is-uppercase is-size-7-mobile">
          {isDisabled ? "metamask not installed" : !isWeb3Enabled ? text : "Connected ✅"}
        </span>
      </button>
    </>
  );
};

export default ConnectButton;
