import React, { useEffect, useState } from "react";

import { Button, Slider } from "antd";
import { Layout } from "antd";
import { Input } from "antd";
import { getZksTokens } from "../api";
import { Steps } from "antd";
import { useParams } from "react-router";
import { Tokens } from "./Tokens";
import { Contract } from "../components";
import { loadContract } from "../hooks/ContractLoader";
import { CompletePayment } from "./CompletePayment";
// import { ConnextModal } from "@connext/vector-modal";

const { utils } = require("ethers");

const { Step } = Steps;

const { Header, Footer, Sider, Content } = Layout;
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
  const [paymentData, setPaymentData] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const [contractAddress, setContractAddress] = useState(urlParams.get("payment", ""));
  const [deployedContract, setDeployedContract] = useState();
  const [error, setError] = useState();

  const getTokens = async () => {
    try {
      const result = await getZksTokens();
      console.log("result", result.data);
      setTokens(result.data.data);
    } catch (e) {
      console.error("err", e);
    }
  };

  useEffect(() => {
    const updateAddress = () => {
      let result;
      try {
        utils.getAddress(contractAddress);
        const newContract = loadContract("PaymentContract", signer, contractAddress);
        setDeployedContract(newContract);
        result = true;
      } catch (e) {
        result = false;
      }
      console.log("res", result);
      setError(result ? "" : `Enter valid address to continue`);
    };
    updateAddress();
  }, [contractAddress]);

  const onUpdate = (k, v) => {
    // console.log("onUpdate", paymentData, k, v);
    paymentData[k] = v;
    setPaymentData({ ...paymentData });
  };

  const adjustStep = offset => {
    if (error && currentStep === 0) {
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
          // 0x9eae40784a2dEE295c32D4Bdc74C4175132B7573
          <div>
            <p>The below is a preview of the contract to be paid. If correct, click next to proceed to payment.</p>
            <Contract
              readOnly
              onUpdate={onUpdate}
              customContract={deployedContract}
              name={"PaymentContract"}
              signer={signer}
              provider={provider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <CompletePayment
              paymentData={paymentData}
              signer={signer}
              provider={provider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </div>
        );
    }
  };

  // useEffect(() => {
  //   getTokens();
  // }, []);
  return (
    <div>
      <Layout>
        <Sider>
          <br />
          <br />
          <br />
          <Steps direction="vertical" current={currentStep}>
            <Step title="Enter Address" description="Enter your invoice contract address" />
            <Step title="Preview Contract" description="Confirm contract details" />
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
            {currentStep != 2 && <Button onClick={() => adjustStep(1)}>{currentStep == 2 ? "Done" : "Next"}</Button>}
            {/* {currentStep === 2 && <Button onClick={() => setShowModal(true)}>Pay with Connext</Button>} */}
          </Footer>
        </Layout>
      </Layout>
      {/* https://docs.connext.network/widget */}
      {/* <ConnextModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onReady={params => console.log("MODAL IS READY =======>", params)}
        withdrawalAddress={"0x75e4DD0587663Fce5B2D9aF7fbED3AC54342d3dB"}
        routerPublicIdentifier="vector7tbbTxQp8ppEQUgPsbGiTrVdapLdU5dH7zTbVuXRf1M4CEBU9Q"
        depositAssetId={"0xbd69fC70FA1c3AED524Bb4E82Adc5fcCFFcD79Fa"}
        depositChainProvider="https://goerli.infura.io/v3/<YOUR_PROJECT_ID>"
        withdrawAssetId={"0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"}
        withdrawChainProvider="https://rpc-mumbai.matic.today"
      /> */}
    </div>
  );
};
