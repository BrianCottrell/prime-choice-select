import React from "react";
import { PageHeader } from "antd";

// displays a page header
import logo from "../assets/logo.png";
import { APP_NAME } from "../constants";
import { Route, useHistory } from "react-router";
import { Link } from "react-router-dom";

const HEADER_ROUTES = ["home", "merchant", "buyers", "about"];

export default function Header() {
  const history = useHistory();
  const title = (
    <span>
      <a href="https://github.com/BrianCottrell/prime-choice-select" target="_blank" rel="noopener noreferrer">
        <img src={logo} className="header-logo" />
        &nbsp;{APP_NAME}
      </a>
    </span>
  );

  const subTitle = (
    <span>
      {HEADER_ROUTES.map((x, i) => {
        const headerRoute = `/${x}`;
        return (
          <span
            key={i}
            className="header-link"
            onClick={() => {
              history.push(headerRoute);
              // window.location.href = headerRoute;
            }}
          >
            {x.capitalize()}
          </span>
        );
      })}
    </span>
  );

  return <PageHeader className='header-black' title={title} subTitle={subTitle} style={{ cursor: "pointer" }} />;
}
