import { Button } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { TARGET_NETWORK_NAME } from "../constants";
import * as zksync from "zksync";
import { deposit, getTokens, getTxFee, submitTx } from "../helpers/zkutil";
import { capitalize, displayValue } from "../util";

export const CompletePayment = ({ paymentData, name, signer, provider, address, blockExplorer }) => {
  const [syncWallet, setSyncWallet] = useState();
  const [syncProvider, setSyncProvider] = useState();
  const [feeMap, setFeeMap] = useState({});
  const [tokens, setTokens] = useState({});
  const [bestToken, setBestToken] = useState();
  const [possibleTokens, setPossibleTokens] = useState([]);

  const initZk = async () => {
    const s = await zksync.getDefaultProvider(TARGET_NETWORK_NAME);
    setSyncProvider(s);
    // if (!syncProvider) {
    //   alert("initZk called without sync provider initialized");
    // }
    const w = await zksync.Wallet.fromEthSigner(signer, s);

    setSyncWallet(w);

    console.log("initZk", w);

    return;

    if (!(await w.isSigningKeySet())) {
      if (w.getAccountId() == undefined) {
        throw new Error("Unknown account");
      }

      // As any other kind of transaction, `ChangePubKey` transaction requires fee.
      // User doesn't have (but can) to specify the fee amount. If omitted, library will query zkSync node for
      // the lowest possible amount.
      const changePubkey = await w.setSigningKey({
        feeToken: "ETH",
        ethAuthType: "ECDSA",
      });

      console.log("setKey", changePubkey, w);

      // Wait until the tx is committed
      await changePubkey.awaitReceipt();
    }
  };

  const transfer2 = async () => {
    const result = await deposit(syncWallet, (ethers.utils.formatEther(paymentData.amount) || "0.01").toString());
    console.log("result", result);
  };

  const submit = async () => {
    await submitTx(syncProvider, syncWallet.address(), paymentData.owner, bestToken.id, paymentData.amount);
  };

  useEffect(() => {
    const paymentTokens = paymentData.supportedTokens;
    if (!paymentTokens) {
      return;
    }
    const filtered = Object.values(tokens).filter(x => paymentTokens.indexOf(x.symbol) !== -1);
    setPossibleTokens(filtered);
    console.log("pt", filtered);
  }, [tokens, paymentData]);

  useEffect(() => {
    const getTokens = async () => {
      console.log("get tokens", syncProvider);
      if (syncProvider) {
        const data = await syncProvider.getTokens();
        console.log("token data", data);
        if (!data["USDT"]) data["USDT"] = { ...data["TUSD"], symbol: "USDT" };
        setTokens(data);
      }
    };

    getTokens();
  }, [syncProvider]);

  const getFee = async token => {
    const { owner } = paymentData;
    const address = owner;
    console.log("fee", address, token.id);
    const result = await getTxFee(syncProvider, address, token.id);
    console.log("fee", result);

    const totalFee = result.totalFee.toString();
    // setFeeMap({ ...feeMap, [token.symbol]: token });
    return totalFee;
  };

  const paymentKeys = Object.keys(paymentData || {});

  const getFees = async () => {
    const costMap = {};
    if (possibleTokens) {
      let bestToken;
      let minFee;
      for (var i in possibleTokens) {
        const fee = await getFee(possibleTokens[i]);
        const token = { ...possibleTokens[i], fee };
        if (!minFee || fee < minFee) {
          minFee = fee;
          bestToken = token;
        }

        costMap[possibleTokens[i].symbol] = fee;
      }
      if (bestToken) {
        setBestToken(bestToken);
      }

      setFeeMap({ ...costMap });
    }
  };

  const etherAmount = ethers.utils.formatEther(paymentData.amount || 0);

  return (
    <div>
      {paymentKeys.map((k, i) => {
        return (
          <p key={i}>
            <b>{capitalize(k)}</b>:&nbsp;{displayValue(paymentData[k])}
          </p>
        );
      })}

      {!syncProvider && (
        <div>
          <br />
          <Button onClick={initZk}>Start payment</Button>
        </div>
      )}

      {possibleTokens.map(x => {
        return (
          <Button key={x.symbol} onClick={() => getFee(x)}>
            {x.symbol}
          </Button>
        );
      })}

      {syncProvider && !bestToken && (
        <div>
          <br />
          <Button onClick={getFees}>Select payment token!</Button>
        </div>
      )}

      {bestToken && (
        <div>
          {(paymentData.paymentType || "").indexOf("Sub") !== -1 && (
            <p>
              Note this is a subscription payment. Transfers will be recurring toward the above for the given amount.
            </p>
          )}
          <p>Complete payment via Layer2 (ZkSync)</p>
          <h2>Best Token:</h2>
          <p>
            ZkSync ID: {bestToken.id}
            <br />
            {bestToken.symbol}
            <br />
            {bestToken.fee} (wei)
          </p>

          {etherAmount && (
            <div>
              <Button onClick={transfer2}>Deposit {etherAmount.toString()} Eth to ZkSync</Button>
              &nbsp;
              <Button onClick={submit}>
                Submit {etherAmount.toString()} Eth via {bestToken.symbol}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
