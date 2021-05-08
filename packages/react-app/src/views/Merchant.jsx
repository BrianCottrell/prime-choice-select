import { Button, Slider } from "antd";
import { Layout } from "antd";

import React, { useEffect, useState } from "react";
import { getZksTokens } from "../api";
import { Steps } from "antd";
import { useContractLoader } from "../hooks";
import { ethers } from "ethers";
import { Select } from "antd";
import { Input } from "antd";

const { TextArea } = Input;

const { Option } = Select;

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

const typeMarks = {
  0: "One time purchase",
  1: "Subscription (monthly)",
};

const timeMarks = {
  2: "Standard",
  1: "Fast",
  0: "Instant",
};

export const Merchant = ({ name, signer, provider, address, blockExplorer }) => {
  const [tokens, setTokens] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [params, setParams] = useState({ speed: 2, amount: 1, coins: [], purpose: "", type: 0 });
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
    let contract = await factory.deploy([params.amount, params.speed, params.coins.join(","), params.purpose]);

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
            <TextArea
              showCount
              rows={4}
              placeholder="Payment purpose"
              value={params.purpose}
              onChange={e => {
                const newParams = { ...params, purpose: e.target.value };
                console.log("new", newParams);
                setParams(newParams);
              }}
            />
            <br />
            <Select
              defaultValue={typeMarks[params.type]}
              style={{ width: 120 }}
              onChange={type => setParams({ ...params, type })}
            >
              {Object.keys(typeMarks).map((x, i) => {
                return (
                  <Option key={x} value={x}>
                    {typeMarks[x]}
                  </Option>
                );
              })}
            </Select>
            <Select
              defaultValue={timeMarks[params.speed]}
              style={{ width: 120 }}
              onChange={speed => setParams({ ...params, speed })}
            >
              {Object.keys(timeMarks).map((x, i) => {
                return (
                  <Option key={x} value={x}>
                    {timeMarks[x]}
                  </Option>
                );
              })}
            </Select>
            <br />
            <hr />
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Select allowed currencies"
              defaultValue={params.coins}
              onChange={coins => setParams({ ...params, coins })}
            >
              {tokens.map(t => {
                return <Option key={t.symbol}>{t.symbol}</Option>;
              })}
            </Select>

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
