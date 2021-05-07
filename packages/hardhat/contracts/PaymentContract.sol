pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
// import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentContract {
  uint256 public price = 0;
  uint256 public maxResolutionTime = 0;
  string[] public supportedTokens;
  address public owner = 0xe5050eC33578Cb72554B696e6721369B660F3C72;

  event SetPrice(address sender, uint256 price);
  event SetMaxResolutionTime(address sender, uint256 maxResolutionTime);
  event SetSupportedTokens(address sender, string[] supportedTokens);

  constructor() public {
  }

  function setPrice(uint256 _price) public {
    price = _price;
    emit SetPrice(msg.sender, price);
  }

  function setMaxResolutionTime(uint256 _maxResolutionTime) public {
    maxResolutionTime = _maxResolutionTime;
    emit SetMaxResolutionTime(msg.sender, maxResolutionTime);
  }

  function setSupportedTokens(string[] memory _supportedTokens) public {
    supportedTokens = _supportedTokens;
    emit SetSupportedTokens(msg.sender, supportedTokens);
  }

}
