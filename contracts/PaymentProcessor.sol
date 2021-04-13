pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentProcessor {
    address public shopOwnerAddress; // address of the Shop's Owner
    IERC20 public dai;

    event PaymentDone(
        address payer,
        uint256 amount,
        uint256 paymentId,
        uint256 date
    );

    constructor(address adminAddress, address daiAddress) {
        shopOwnerAddress = adminAddress;
        dai = IERC20(daiAddress);
    }

    function pay(uint256 amount, uint256 paymentId) external {
        dai.transferFrom(msg.sender, shopOwnerAddress, amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    }
}
