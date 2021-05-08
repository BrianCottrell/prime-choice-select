import React, { useEffect, useState } from "react";

import { Button, Slider } from "antd";
import { Layout } from "antd";
import { Input } from "antd";
import { getZksTokens } from "../api";
import { Steps } from "antd";
import { useParams } from "react-router";
import { Tokens } from "./Tokens";
// import { ConnextModal } from "@connext/vector-modal";

const { utils } = require("ethers");

const { Step } = Steps;

const { Header, Footer, Sider, Content } = Layout;

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
  standard: "standard",
  fast: "fast",
  instant: "instant",
};

export const Payer = ({ name, signer, provider, address, blockExplorer }) => {
  const [tokens, setTokens] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState({});
  const [showModal, setShowModal] = React.useState(false);

  let { payment } = useParams();
  console.log("payment", payment);
  const urlParams = new URLSearchParams(window.location.search);
  const [contractAddress, setContractAddress] = useState(urlParams.get("payment", ""));
  const [error, setError] = useState();

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
    let result;
    try {
      utils.getAddress(contractAddress);
      result = true;
    } catch (e) {
      result = false;
    }
    console.log("res", result);
    setError(result ? "" : `Enter valid address to continue`);
  }, [contractAddress]);

  const adjustStep = offset => {
    if (error) {
      return;
    }
    setCurrentStep(currentStep + offset);
  };

  const getBody = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h1>Invoice Address:</h1>
            <Input
              placeholder="Enter invoice address"
              value={contractAddress}
              onChange={e => setContractAddress(e.target.value)}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <Tokens />
          </div>
        );
      case 2:
        return (
          <div>
            <h1>Contract Created</h1>
          </div>
        );
    }
  };

  useEffect(() => {
    getTokens();
  }, []);
  return (
    <div>
      <Layout>
        <Sider>
          <br />
          <br />
          <br />
          <Steps direction="vertical" current={currentStep}>
            <Step title="Enter Address" description="Enter your invoice contract address" />
            <Step title="Select Token" description="Select optimal token" />
            <Step title="Payment" description="Use suggested token to pay" />
          </Steps>
        </Sider>
        <Layout>
          <Header>
            <h1>Primechoice Select</h1>
          </Header>
          <Content className="content">{getBody()}</Content>
          <Footer>
            {error && <p className="error-text">{error}</p>}
            {currentStep != 0 && <Button onClick={() => adjustStep(-1)}>Back</Button>}
            {currentStep != 2 && (
              <div>
                <Button onClick={() => adjustStep(1)}>{currentStep == 2 ? "Done" : "Next"}</Button>
              </div>
            )}
            {currentStep === 2 && <Button onClick={() => setShowModal(true)}>Pay with Connext</Button>}
          </Footer>
        </Layout>
      </Layout>
      {/* https://docs.connext.network/widget */}
      <ConnextModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onReady={params => console.log("MODAL IS READY =======>", params)}
        withdrawalAddress={"0x75e4DD0587663Fce5B2D9aF7fbED3AC54342d3dB"}
        routerPublicIdentifier="vector7tbbTxQp8ppEQUgPsbGiTrVdapLdU5dH7zTbVuXRf1M4CEBU9Q"
        depositAssetId={"0xbd69fC70FA1c3AED524Bb4E82Adc5fcCFFcD79Fa"}
        depositChainProvider="https://goerli.infura.io/v3/<YOUR_PROJECT_ID>"
        withdrawAssetId={"0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"}
        withdrawChainProvider="https://rpc-mumbai.matic.today"
      />
    </div>
  );
};
