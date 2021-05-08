pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentContract is Ownable {
  int public price;
  int public maxResolutionTime;
  string public supportedTokens;
  string public purpose;
  address public owner = 0xe5050eC33578Cb72554B696e6721369B660F3C72;

  event SetPrice(address sender, int price);
  event SetMaxResolutionTime(address sender, int maxResolutionTime);
  event SetSupportedTokens(address sender, string supportedTokens);
  event SetPurpose(address sender, string purpose);

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

  constructor(int _price, int _maxResolutionTime, string memory _supportedTokens, string memory _purpose) public {
    price = _price;
    maxResolutionTime = _maxResolutionTime;
    supportedTokens = _supportedTokens;
    purpose = _purpose;
    usdPriceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    linkPriceFeed = AggregatorV3Interface(0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38);
    uniPriceFeed = AggregatorV3Interface(0x17756515f112429471F86f98D5052aCB6C47f6ee);
  }

  function setPrice(int _price) public onlyOwner {
    price = _price;
    emit SetPrice(msg.sender, price);
  }

  function setMaxResolutionTime(int _maxResolutionTime) public onlyOwner {
    maxResolutionTime = _maxResolutionTime;
    emit SetMaxResolutionTime(msg.sender, maxResolutionTime);
  }

  function setSupportedTokens(string memory _supportedTokens) public onlyOwner {
    supportedTokens = _supportedTokens;
    emit SetSupportedTokens(msg.sender, supportedTokens);
  }

  function setPurpose(string memory _purpose) public onlyOwner {
    purpose = _purpose;
    emit SetPurpose(msg.sender, purpose);
  }

  function usdPrice() public view returns (int) {
    (
      uint80 roundID, 
      int priceConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = usdPriceFeed.latestRoundData();
    return price * priceConversion;
  }

  function linkToEth() public view returns (int) {
    (
      uint80 roundID, 
      int priceConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = linkPriceFeed.latestRoundData();
    return priceConversion;
  }

  function uniToEth() public view returns (int) {
    (
      uint80 roundID, 
      int priceConversion,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = uniPriceFeed.latestRoundData();
    return priceConversion;
  }
}
