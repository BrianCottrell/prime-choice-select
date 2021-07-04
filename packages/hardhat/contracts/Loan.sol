pragma solidity >=0.7.0 <0.9.0;

contract Loan {
    address payable public lender;
    address payable[] public borrowers;
    uint public amount;
    uint public index;
    
    constructor() {
        lender = payable(msg.sender);
    }
    
    receive() external payable {}

    function lend() public payable restricted {
        require(address(this).balance > .0001 ether);
        amount = address(this).balance;
        index = 0;
        if (borrowers.length > index) {
            borrowers[index].transfer(address(this).balance);
        }
    }

    function repay() public {
        if (address(this).balance >= amount) {
            if (index <= borrowers.length - 1) {
                index++;
                borrowers[index].transfer(address(this).balance);
            } else {
                lender.transfer(address(this).balance);
            }
        }
    }

    function addBorrower(address payable borrower) public restricted {
        borrowers.push(borrower);
    }
   
    function getBorrowers() public view returns(address payable[] memory) {
        return borrowers;
    }

    function getAmount() public view returns(uint) {
        return amount;
    }

    function getIndex() public view returns(uint) {
        return index;
    }
    
    modifier restricted() {
        require(msg.sender == lender);
        _;
    }
}
