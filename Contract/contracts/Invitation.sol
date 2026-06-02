// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Invitation {
    address public constant ROOT_ADDRESS = 0xE2CE73BF4776970a0C6E58F658929B125d749483;
    uint256 public constant MAX_REFER_LEVEL = 100;

    mapping(address => address) public inviter;
    mapping(address => address[]) public invitees;
    mapping(address => uint256) public teamCount;

    event Bind(address indexed user, address indexed inviter);

    function bind(address _inviter) external {
        require(_inviter != address(0), "Invitation: invalid inviter");
        require(inviter[msg.sender] == address(0), "Invitation: already bound");
        require(_inviter == ROOT_ADDRESS || inviter[_inviter] != address(0), "Invitation: inviter not bound");

        inviter[msg.sender] = _inviter;
        invitees[_inviter].push(msg.sender);

        address current = _inviter;
        for (uint256 i = 0; i < MAX_REFER_LEVEL; i++) {
            if (current == address(0)) {
                break;
            }
            teamCount[current]++;
            current = inviter[current];
        }

        emit Bind(msg.sender, _inviter);
    }

    function getInviter(address _user) external view returns (address) {
        return inviter[_user];
    }

    function getInvitees(address _user) external view returns (address[] memory) {
        return invitees[_user];
    }

    function getInviteeCount(address _user) external view returns (uint256) {
        return invitees[_user].length;
    }

    function getTeamCount(address _user) external view returns (uint256) {
        return teamCount[_user];
    }

    function isBound(address _user) external view returns (bool) {
        return inviter[_user] != address(0);
    }
}
