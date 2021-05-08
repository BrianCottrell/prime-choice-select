import { Button, Slider } from "antd";
import { Layout } from "antd";

import React, { useEffect, useState } from "react";
import { getZksTokens } from "../api";
import { Steps } from "antd";
import { useContractLoader } from "../hooks";
import { ethers } from "ethers";

const { Step } = Steps;

const { Header, Footer, Sider, Content } = Layout;

const amountMarks = {
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

export const Merchant = ({ name, signer, provider, address, blockExplorer }) => {
  const [tokens, setTokens] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState({});
  const [deployedAddress, setDeployedAddress] = useState();
  const contracts = useContractLoader(provider);

  const getTokens = async () => {
    try {
      const { data } = await getZksTokens();
      console.log("result", data);
      setTokens(data.data);
    } catch (e) {
      console.error("err", e);
    }
  };

  const adjustStep = async offset => {
    const nextStep = currentStep + offset;
    if (nextStep == 2) {
      await deploy();
      return;
    }
    setCurrentStep(nextStep);
  };

  const deploy = async () => {
    const { abi, bytecode } = contracts.PaymentContract;

    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, signer);

    // Notice we pass in "Hello World" as the parameter to the constructor
    let contract = await factory.deploy(0, 0, "", "");

    // The address the Contract WILL have once mined
    // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
    console.log("address", contract.address);
    setDeployedAddress(contract.address);
    setCurrentStep(2);
  };

  const getBody = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Slider marks={amountMarks} step={10} defaultValue={0} />
            <Slider marks={timeMarks} step={10} defaultValue={37} />
            {/* <Slider marks={coinMarks} step={10} defaultValue={37} /> */}
          </div>
        );
      case 1:
        // https://docs.ethers.io/v4/api-contract.html#deploying-a-contract
        return <div></div>;
      case 2:
        return (
          <div>
            <h1>Contract Created</h1>
            <p>{deployedAddress}</p>
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
            <Step title="Create Payment" description="What do you want to collect?" />
            <Step title="Deploy" description="Register invoice" />
            <Step title="Complete" description="Use this contract to collect payment" />
          </Steps>
          ,
        </Sider>
        <Layout>
          <Header>
            <h1>Register a Payment</h1>
          </Header>
          <Content className="content">{getBody()}</Content>
          <Footer>
            {currentStep != 0 && <Button onClick={() => adjustStep(-1)}>Back</Button>}
            {currentStep != 2 && (
              <Button onClick={() => adjustStep(1)}>
                {currentStep == 2 ? "Done" : currentStep == 1 ? "Deploy" : "Next"}
              </Button>
            )}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
