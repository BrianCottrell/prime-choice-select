import { Button, Slider } from "antd";
import { Layout } from "antd";

import React, { useEffect, useState } from "react";
import { getZksTokens } from "../api";
import { Steps } from "antd";
import { useContractLoader } from "../hooks";
import { ethers } from "ethers";
import { Select } from "antd";
import { Input } from "antd";
import { TARGET_NETWORK_NAME, TELLOR_ADDRESS } from "../constants";

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const { Header, Footer, Sider, Content } = Layout;

const typeMarks = {
  0: "One time purchase",
  1: "Subscription (monthly)",
  2: "Subscription (daily)",
};

const timeMarks = {
  2: "Standard",
  1: "Fast",
  0: "Instant",
};

export const Merchant = ({ name, signer, provider, address, blockExplorer }) => {
  const [tokens, setTokens] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [params, setParams] = useState({ speed: 2, amount: undefined, coins: [], purpose: "", type: 0 });
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

    const amount = parseInt(params.amount);

    let contract = await factory.deploy(amount, params.speed, params.coins.join(","), params.purpose, TELLOR_ADDRESS);

    console.log("address", contract.address);
    setDeployedAddress(contract.address);
    setCurrentStep(2);
  };

  const getBody = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <p>Enter the description for the payment</p>
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
            <Input
              suffix={"Ether"}
              size="large"
              placeholder="XXX Eth"
              value={params.amount}
              onChange={e => setParams({ ...params, amount: e.target.value })}
            />
            <br />
            <p>Payment details:</p>
            <Select
              defaultValue={typeMarks[params.type]}
              style={{ width: 240 }}
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
            <br />
            <p>Allowed currencies:</p>
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
        const keys = Object.keys(params);
        return (
          <div>
            <h1>Preview Payment:</h1>
            {keys.map((k, i) => {
              return (
                <p key={i}>
                  <b>{k}</b>: {Array.isArray(params[k]) ? params[k].join(", ") : params[k]}
                </p>
              );
            })}
          </div>
        );
      case 2:
        const payUrl = `${window.location.hostname}/send?payment=${deployedAddress}`;
        return (
          <div>
            <h1>Contract Created!</h1>
            <p>
              <b>{deployedAddress}</b>
            </p>
            <p>
              Payment url:{" "}
              <a href={payUrl} target="_blank">
                {payUrl}
              </a>
            </p>
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
            <h1>Create Payment Request</h1>
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
