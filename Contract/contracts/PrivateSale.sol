// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

interface IInvitation {
    function inviter(address _user) external view returns (address);
    function MAX_REFER_LEVEL() external view returns (uint256);
}

contract PrivateSale {
    address public immutable usdt;
    address public immutable invitation;

    address public constant RECEIVER = 0x4F948fbf0922903cd7F928a8b3031CEed512E907;

    uint256 public constant MIN_PURCHASE = 200 * 10**18;

    uint256 public totalRaised;

    // 用户业绩统计：所有下级捐赠的总和
    mapping(address => uint256) public userPerformance;

    struct Purchase {
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    Purchase[] public purchases;

    mapping(address => uint256[]) public userPurchaseIds;

    event Subscribe(address indexed buyer, uint256 amount, uint256 timestamp);

    constructor(address _usdt, address _invitation) {
        require(_usdt != address(0), "PrivateSale: invalid USDT address");
        require(_invitation != address(0), "PrivateSale: invalid invitation address");
        usdt = _usdt;
        invitation = _invitation;
    }

    function subscribe(uint256 _amount) external {
        require(_amount >= MIN_PURCHASE, "PrivateSale: amount too small");

        IERC20(usdt).transferFrom(msg.sender, RECEIVER, _amount);

        uint256 purchaseId = purchases.length;
        purchases.push(Purchase({
            buyer: msg.sender,
            amount: _amount,
            timestamp: block.timestamp
        }));
        userPurchaseIds[msg.sender].push(purchaseId);

        totalRaised += _amount;

        // 给所有上级邀请人增加业绩
        address current = IInvitation(invitation).inviter(msg.sender);
        uint256 maxLevel = IInvitation(invitation).MAX_REFER_LEVEL();
        for (uint256 i = 0; i < maxLevel; i++) {
            if (current == address(0)) {
                break;
            }
            userPerformance[current] += _amount;
            current = IInvitation(invitation).inviter(current);
        }

        emit Subscribe(msg.sender, _amount, block.timestamp);
    }

    function getPurchaseCount() external view returns (uint256) {
        return purchases.length;
    }

    function getUserPurchaseIds(address _user) external view returns (uint256[] memory) {
        return userPurchaseIds[_user];
    }

    function getUserPurchaseCount(address _user) external view returns (uint256) {
        return userPurchaseIds[_user].length;
    }

    function getUserTotalAmount(address _user) external view returns (uint256) {
        uint256 total = 0;
        uint256[] memory ids = userPurchaseIds[_user];
        for (uint256 i = 0; i < ids.length; i++) {
            total += purchases[ids[i]].amount;
        }
        return total;
    }

    function getUserPerformance(address _user) external view returns (uint256) {
        return userPerformance[_user];
    }

    function getPurchases(uint256 _start, uint256 _count) external view returns (Purchase[] memory) {
        uint256 end = _start + _count;
        if (end > purchases.length) {
            end = purchases.length;
        }
        uint256 resultCount = end - _start;
        Purchase[] memory result = new Purchase[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = purchases[_start + i];
        }
        return result;
    }
}
