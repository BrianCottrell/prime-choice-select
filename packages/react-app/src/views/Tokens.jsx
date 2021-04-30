import React, { useEffect, useState } from "react";
import { getZksTokens } from "../api";

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
  };

  useEffect(() => {
    getTokens();
  }, []);
  return (
    <div>
      {tokens.map((t, i) => {
        const { address, symbol, icon } = t;
        return (
          <span>
            <img src={icon} className="token-symbol" />
            {symbol}
          </span>
        );
      })}
    </div>
  );
};
