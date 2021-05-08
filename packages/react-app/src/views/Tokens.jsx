import React, { useEffect, useState } from "react";
import { getZapperGasPrices, getZksTokens } from "../api";
import * as ethers from "ethers";
import { ABI } from "../helpers/zk_abi";

const wallet = new ethers.Wallet("0x1c1a49fea9a4ede1dc8e582639f498d41fa3c4a9e2ab2b9d740a4a3ec14e1cbf");
const contract = new ethers.Contract("0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad", ABI, wallet);

export const Tokens = props => {
  const [tokens, setTokens] = useState([]);

  const getTokens = async () => {
    try {
      const { data } = await getZksTokens();
      console.log("result", data);
      setTokens(data.data);
    } catch (e) {
      console.error("err", e);
    }
    // const syncHttpProvider = await zksync.getDefaultProvider("rinkeby");
    // const contractAddresses = await syncHttpProvider.getTokens();
  };

  const getNetworkFee = async () => {
    try {
      const { data } = await getZapperGasPrices("polygon");
      console.log("data", data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getTokens();
    getNetworkFee();
  }, []);
  return (
    <div>
      {tokens.map((t, i) => {
        const { address, symbol, icon } = t;
        return (
          <div>
            <img src={icon} className="token-symbol" />
            {symbol} - {address}
          </div>
        );
      })}
    </div>
  );
};
