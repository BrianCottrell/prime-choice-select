import React, { useState } from "react";
import { Button } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { WalletOutlined } from "@ant-design/icons";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

const torus = new Torus({});

const TORUS = false;

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  const [account, setAccount] = useState();

  const onClickLogin = async e => {
    e.preventDefault();

    try {
      await torus.init({
        enableLogging: false,
      });
    } catch (e) {}
    await torus.login();

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    const acc = { address, balance };
    console.log("torus account", acc);

    setAccount(acc);
  };

  const onLogout = async () => {
    await torus.logout();
    setAccount(undefined);
  };

  if (web3Modal) {
    if (web3Modal.cachedProvider || account) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={TORUS ? onLogout : logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          /*type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time*/
          onClick={TORUS ? onClickLogin : loadWeb3Modal}
        >
          <WalletOutlined />
          Connect Wallet
        </Button>,
      );
    }
  }

  const { currentTheme } = useThemeSwitcher();
  address = account ? account.address : address;

  const initialized = !!account;

  const display =
    minimized || !initialized ? (
      ""
    ) : (
      <span>
        {address ? (
          <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
        ) : (
          "Connecting..."
        )}
        <Balance address={address} provider={localProvider} price={price} />
        <Wallet
          address={address}
          provider={userProvider}
          ensProvider={mainnetProvider}
          price={price}
          color={currentTheme == "light" ? "#1890ff" : "#2caad9"}
        />
      </span>
    );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
