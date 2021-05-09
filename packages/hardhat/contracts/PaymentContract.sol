pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../deps/UsingTellor.sol";

// https://github.com/superfluid-finance

contract PaymentContract is Ownable, UsingTellor {
  int public amount;
  int public maxResolutionTime;
  string public paymentType;
  string public supportedTokens;
  string public purpose;

  address public payer;
  string public selectedToken;

  /**
   * Tellor
   * Network: Ropsten
   *
   * ID: 1  Data: ETH/USD
   * ID: 3  Data: BNB/USD
   * ID: 27 Data: LINK/USD
   * ID: 39 Data: DAI/USD
   */
  uint256 public ethPrice;
  uint256 ethRequestId = 1;
  uint256 public bnbPrice;
  uint256 bnbRequestId = 3;
  uint256 public linkPrice;
  uint256 linkRequestId = 27;
  uint256 public daiPrice;
  uint256 daiRequestId = 39;

  event PaymentActivated(address sender, string selectedToken);

  /**
   * Chainlink
   * Network: Kovan
   *
   * Aggregator: ETH/USD
   * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
   * Aggregator: LINK/ETH
   * Address: 0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38
   * Aggregator: UNI/ETH
   * Address: 0x17756515f112429471F86f98D5052aCB6C47f6ee
   * Aggregator: DAI/ETH
   * Address: 0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541
   */
  AggregatorV3Interface internal usdPriceFeed;
  AggregatorV3Interface internal linkPriceFeed;
  AggregatorV3Interface internal uniPriceFeed;
  AggregatorV3Interface internal daiPriceFeed;

  constructor(int _amount, int _maxResolutionTime, string memory _supportedTokens, 
  string memory _purpose, string memory _paymentType,
 address payable _tellorAddress
  ) UsingTellor(_tellorAddress) public {
    amount = _amount;
    maxResolutionTime = _maxResolutionTime;
    supportedTokens = _supportedTokens;
    purpose = _purpose;
    paymentType = _paymentType;
    usdPriceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    linkPriceFeed = AggregatorV3Interface(0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38);
    uniPriceFeed = AggregatorV3Interface(0x17756515f112429471F86f98D5052aCB6C47f6ee);
    daiPriceFeed = AggregatorV3Interface(0x17756515f112429471F86f98D5052aCB6C47f6ee);
  }

  function setAmount(int _amount) public {
    amount = _amount;
  }

  function setMaxResolutionTime(int _maxResolutionTime) public {
    maxResolutionTime = _maxResolutionTime;
  }

  function setSupportedTokens(string memory _supportedTokens) public {
    supportedTokens = _supportedTokens;
  }

  function setPurpose(string memory _purpose) public onlyOwner {
    purpose = _purpose;
  }

  function setPaymentType(string memory _paymentType) public onlyOwner {
    paymentType = _paymentType;
  }

  function activate(string memory _selectedToken) public {
    selectedToken = _selectedToken;
    emit PaymentActivated(msg.sender, selectedToken);
  }

  function kovanUsdPrice() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = usdPriceFeed.latestRoundData();
    return amount * amountConversion;
  }

  function kovanLinkToEth() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = linkPriceFeed.latestRoundData();
    return amountConversion;
  }

  function kovanUniToEth() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = uniPriceFeed.latestRoundData();
    return amountConversion;
  }

  function kovanDaiToEth() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = daiPriceFeed.latestRoundData();
    return amountConversion;
  }

  function ropstenGetEthPrice() public {
    bool _didGet;
    uint _timestamp;
    uint _value;
    (_didGet, ethPrice, _timestamp) = getCurrentValue(ethRequestId);
  }

  function ropstenGetLinkPrice() public {
    bool _didGet;
    uint _timestamp;
    uint _value;
    (_didGet, linkPrice, _timestamp) = getCurrentValue(linkRequestId);
  }

  function ropstenGetDaiPrice() public {
    bool _didGet;
    uint _timestamp;
    uint _value;
    (_didGet, daiPrice, _timestamp) = getCurrentValue(daiRequestId);
  }

  function ropstenGetBnbPrice() public {
    bool _didGet;
    uint _timestamp;
    uint _value;
    (_didGet, bnbPrice, _timestamp) = getCurrentValue(bnbRequestId);
  }
}

