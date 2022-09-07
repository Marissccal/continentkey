const WrongChainWarning = () => {
  return (
    <div className="notification is-danger has-text-centered mb-0 mt-3 custom-position-chain-warning">
      WARNING: You are connected to a network that <strong>is not</strong> Mainnet. Change your network in your Wallet
      to avoid doing something rare!
    </div>
  );
};

export default WrongChainWarning;
