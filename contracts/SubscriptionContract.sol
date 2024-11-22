// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionContract {
    address public owner;
    uint256 public subscriptionPrice = 0.002 ether;  // 约 $5
    mapping(address => uint256) public subscriptions;

    event NewSubscription(address subscriber, uint256 endTime);
    event PriceUpdated(uint256 newPrice);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function subscribe() external payable {
        require(msg.value == subscriptionPrice, "Incorrect payment amount");
        
        uint256 endTime;
        if (subscriptions[msg.sender] > block.timestamp) {
            // 如果已有订阅，则延长30天
            endTime = subscriptions[msg.sender] + 30 days;
        } else {
            // 新订阅从现在开始30天
            endTime = block.timestamp + 30 days;
        }
        
        subscriptions[msg.sender] = endTime;
        emit NewSubscription(msg.sender, endTime);
    }

    function updatePrice(uint256 _newPrice) external onlyOwner {
        subscriptionPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    function isSubscribed(address _subscriber) external view returns (bool) {
        return subscriptions[_subscriber] > block.timestamp;
    }

    function getSubscriptionEndTime(address _subscriber) external view returns (uint256) {
        return subscriptions[_subscriber];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
