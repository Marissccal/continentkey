import { useMoralis } from "react-moralis";

import { useState } from "react";
import Logo from "../img/Logo.png";

const Navbar = ({ setSelectedTab, setShowWalletModal, setShowDisconnectModal }) => {
  const [isActive, setIsActive] = useState(false);
  const { isWeb3Enabled, chainId, account } = useMoralis();

  const tempAccount = account;
  let truncatedAccount = "";
  if (tempAccount !== null) {
    truncatedAccount = `${tempAccount.slice(0, 4)}...${tempAccount.slice(-4)}`;
  }

  function scrollToTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  }

  async function handleConnectDisconnect() {
    if (isWeb3Enabled) {
      setShowDisconnectModal(true);
    } else {
      setShowWalletModal(true);
    }
  }

  return (
    <>
      <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand is-flex is-align-items-center">
          <figure className="image is-64x64 custom-nav-img pl-3 is-flex is-align-items-center">
            <img className="" src={Logo} />
          </figure>
          <div className="navbar-item">
            <div className="custom-connect-status" onClick={handleConnectDisconnect}>
              <span className="custom-connect-status__network">Network ID: {parseInt(chainId) || ""}</span>
              <span className="custom-connect-status__account">Account: {truncatedAccount}</span>
            </div>
          </div>
          {/* <span className="navbar-item shizuru is-size-3 is-hidden-touch">CKNFT</span> */}

          <button
            role="button"
            className={`navbar-burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target=""
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div id="" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-end">            
            <a
              className="navbar-item"
              onClick={() => {
                setSelectedTab("Mint");
                setIsActive(false);
                scrollToTop();
              }}
            >
              Mint
            </a>
            <a
              className="navbar-item"
              onClick={() => {
                setSelectedTab("Gallery");
                setIsActive(false);
                scrollToTop();
              }}
            >
              Your CKNFT
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
