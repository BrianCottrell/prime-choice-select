import { Slider } from "antd";
import React, { useEffect, useState } from "react";
import { getZksTokens } from "../api";

const marks = {
  0: "0°C",
  26: "26°C",
  37: "37°C",
  100: {
    style: {
      color: "#f50",
    },
    label: <strong>100°C</strong>,
  },
};

const timeMarks = {
    standard: 'standard',
    fast: 'fast',
    instant: 'instant',

}

export const Merchant = props => {
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
      <Slider marks={marks} step={10} defaultValue={37} />
    </div>
  );
};
