import React from "react";
import { PageHeader } from "antd";

// displays a page header
import logo from "../assets/logo.png";
import { APP_NAME } from "../constants";

export default function Header() {
  const title = (
    <span>
      <img src={logo} className="header-logo" />
      &nbsp;{APP_NAME}
    </span>
  );

  return (
    <a href="https://github.com/BrianCottrell/prime-choice-select" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title={title}
        subTitle="A blockchain aggregator to help you the cheapest network"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
