import { Button } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { TARGET_NETWORK_NAME } from "../constants";
import * as zksync from "zksync";
import { deposit } from "../helpers/zkutil";

export const CompletePayment = ({ name, signer, provider, address, blockExplorer }) => {
  const [wallet, setWallet] = useState();
  const [syncWallet, setSyncWallet] = useState();
  const [amount, setAmount] = useState();
  useEffect(() => {
    const init = async () => {
      let pk = localStorage.getItem("metaPrivateKey");
      let ethWallet = new ethers.Wallet(pk);
      setWallet(ethWallet);
    };

    init();
  }, []);

  const initZk = async () => {
    console.log("initZk", TARGET_NETWORK_NAME);
    const syncProvider = await zksync.getDefaultProvider(TARGET_NETWORK_NAME);
    const w = await zksync.Wallet.fromEthSigner(wallet, syncProvider);

    setSyncWallet(w);
  };

  const transfer2 = async () => {
    const result = await deposit(syncWallet, ".01");
    console.log("result", result);
  };

  useEffect(() => {
    if (!wallet) {
      return;
    }

    initZk();
  }, [wallet]);

  return (
    <div>
      <Button onClick={transfer2}>Deposit via ZkSync</Button>
    </div>
  );
};
