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
  string public supportedTokens;
  string public purpose;

  address public payer;
  string public selectedToken;

    uint256 btcPrice;
  uint256 btcRequetId = 2;

  // constructor(address payable _tellorAddress)  public {}

  function setBtcPrice() public {
    bool _didGet;
    uint _timestamp;
    uint _value;

    (_didGet, btcPrice, _timestamp) = getCurrentValue(btcRequetId);
  }

  event PaymentActivated(address sender, string selectedToken);

  /**
   * Network: Kovan
   * Aggregator: ETH/USD
   * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
   * Aggregator: LINK/ETH
   * Address: 0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38
   * Aggregator: UNI/ETH
   * Address: 0x17756515f112429471F86f98D5052aCB6C47f6ee
   */
  AggregatorV3Interface internal usdPriceFeed;
  AggregatorV3Interface internal linkPriceFeed;
  AggregatorV3Interface internal uniPriceFeed;

  constructor(int _amount, int _maxResolutionTime, string memory _supportedTokens, string memory _purpose,
 address payable _tellorAddress
  ) UsingTellor(_tellorAddress) public {
    amount = _amount;
    maxResolutionTime = _maxResolutionTime;
    supportedTokens = _supportedTokens;
    purpose = _purpose;
    usdPriceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    linkPriceFeed = AggregatorV3Interface(0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38);
    uniPriceFeed = AggregatorV3Interface(0x17756515f112429471F86f98D5052aCB6C47f6ee);
  }

  function setAmount(int _amount) public onlyOwner {
    amount = _amount;
  }

  function setMaxResolutionTime(int _maxResolutionTime) public onlyOwner {
    maxResolutionTime = _maxResolutionTime;
  }

  function setSupportedTokens(string memory _supportedTokens) public onlyOwner {
    supportedTokens = _supportedTokens;
  }

  function setPurpose(string memory _purpose) public onlyOwner {
    purpose = _purpose;
  }

  function activate(string memory _selectedToken) public {
    selectedToken = _selectedToken;
    emit PaymentActivated(msg.sender, selectedToken);
  }

  function usdPrice() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = usdPriceFeed.latestRoundData();
    return amount * amountConversion;
  }

  function linkToEth() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = linkPriceFeed.latestRoundData();
    return amountConversion;
  }

  function uniToEth() public view returns (int) {
    (
      uint80 roundID, 
      int amountConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = uniPriceFeed.latestRoundData();
    return amountConversion;
  }
}
