import { Button } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { TARGET_NETWORK_NAME } from "../constants";
import * as zksync from "zksync";
import { deposit, getTokens } from "../helpers/zkutil";

export const CompletePayment = ({ paymentData, name, signer, provider, address, blockExplorer }) => {
  const [wallet, setWallet] = useState();
  const [syncWallet, setSyncWallet] = useState();
  const [syncProvider, setSyncProvider] = useState();
  const [tokens, setTokens] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    const init = async () => {
      let pk = localStorage.getItem("metaPrivateKey");
      let ethWallet = new ethers.Wallet(pk, provider);
      setWallet(ethWallet);
    };

    init();
  }, []);

  const transfer2 = async () => {
    const result = await deposit(syncWallet, "0.01");
    console.log("result", result);
  };

  useEffect(() => {
    const getTokens = async () => {
      console.log("get tokens", syncProvider);
      if (syncProvider) {
        const { data } = await syncProvider.getTokens();
        console.log("token data", data);
        setTokens(data);
      }
    };

    getTokens();
  }, [syncProvider]);

  useEffect(() => {
    const initZk = async () => {
      if (!wallet) {
        return;
      }
      console.log("initZk", wallet, wallet.provider, TARGET_NETWORK_NAME);
      const s = await zksync.getDefaultProvider(TARGET_NETWORK_NAME);
      const w = await zksync.Wallet.fromEthSigner(wallet, s);

      setSyncProvider(s);
      setSyncWallet(w);
    };
    initZk();
  }, [wallet]);

  return (
    <div>
      {JSON.stringify(paymentData)}
      {JSON.stringify(tokens)}
      <Button onClick={transfer2}>Deposit via ZkSync</Button>
    </div>
  );
};
