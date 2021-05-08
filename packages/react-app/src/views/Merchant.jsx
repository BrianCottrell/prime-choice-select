import { Button, Slider } from "antd";
import { Layout } from "antd";

import React, { useEffect, useState } from "react";
import { getZksTokens } from "../api";
import { Steps } from "antd";

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

  const getTokens = async () => {
    try {
      const { data } = await getZksTokens();
      console.log("result", data);
      setTokens(data.data);
    } catch (e) {
      console.error("err", e);
    }
  };

  const adjustStep = offset => {
    setCurrentStep(currentStep + offset);
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
        return <div></div>;
      case 1:
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
            {currentStep != 2 && <Button onClick={() => adjustStep(1)}>{currentStep == 2 ? "Done" : "Next"}</Button>}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
