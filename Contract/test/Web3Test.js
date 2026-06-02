const { expect } = require("chai");
const Web3 = require("web3");

describe("Web3.js Contract Calls", function () {
  let web3;
  let invitation;
  let owner;
  let addr1;
  let addr2;
  const ROOT_ADDRESS = "0xE2CE73BF4776970a0C6E58F658929B125d749483";
  const INVITATION_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "inviter",
          "type": "address"
        }
      ],
      "name": "Bind",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ROOT_ADDRESS",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_inviter", "type": "address" }],
      "name": "bind",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "getInviter",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "isBound",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  beforeEach(async function () {
    // 使用 Hardhat 节点
    web3 = new Web3("http://127.0.0.1:8545");

    // 获取测试账户
    const accounts = await web3.eth.getAccounts();
    owner = accounts[0];
    addr1 = accounts[1];
    addr2 = accounts[2];

    // 部署合约
    const Invitation = await ethers.getContractFactory("Invitation");
    const invitationEthers = await Invitation.deploy();
    const contractAddress = await invitationEthers.getAddress();

    // 使用 Web3.js 创建合约实例
    invitation = new web3.eth.Contract(INVITATION_ABI, contractAddress);
  });

  describe("isBound function with Web3.js", function () {
    it("Should return false for unbound address", async function () {
      const result = await invitation.methods.isBound(addr1).call();
      console.log("isBound (unbound) raw result:", result);
      console.log("isBound (unbound) type:", typeof result);
      expect(result).to.be.false;
    });

    it("Should return true for bound address", async function () {
      // 先使用 ethers 绑定
      const Invitation = await ethers.getContractFactory("Invitation");
      const invitationEthers = Invitation.attach(await invitation._address);
      await invitationEthers.connect(await ethers.getSigner(addr1)).bind(ROOT_ADDRESS);

      const result = await invitation.methods.isBound(addr1).call();
      console.log("isBound (bound) raw result:", result);
      console.log("isBound (bound) type:", typeof result);
      expect(result).to.be.true;
    });

    it("Should test multiple calls together", async function () {
      // 先绑定
      const Invitation = await ethers.getContractFactory("Invitation");
      const invitationEthers = Invitation.attach(await invitation._address);
      await invitationEthers.connect(await ethers.getSigner(addr1)).bind(ROOT_ADDRESS);

      console.log("\n--- Testing multiple calls ---");

      // 测试 isBound
      const boundResult = await invitation.methods.isBound(addr1).call();
      console.log("isBound result:", boundResult, "type:", typeof boundResult);

      // 测试 getInviter
      const inviterResult = await invitation.methods.getInviter(addr1).call();
      console.log("getInviter result:", inviterResult, "type:", typeof inviterResult);

      // 测试 ROOT_ADDRESS
      const rootResult = await invitation.methods.ROOT_ADDRESS().call();
      console.log("ROOT_ADDRESS result:", rootResult, "type:", typeof rootResult);

      expect(boundResult).to.be.true;
      expect(inviterResult).to.equal(ROOT_ADDRESS);
    });

    it("Should test type conversion", async function () {
      const Invitation = await ethers.getContractFactory("Invitation");
      const invitationEthers = Invitation.attach(await invitation._address);
      await invitationEthers.connect(await ethers.getSigner(addr1)).bind(ROOT_ADDRESS);

      const result = await invitation.methods.isBound(addr1).call();

      console.log("\n--- Type conversion test ---");
      console.log("Raw result:", result);
      console.log("Boolean(result):", Boolean(result));
      console.log("result === true:", result === true);
      console.log("result == true:", result == true);
      console.log("!!result:", !!result);

      // 确保正确的布尔处理
      const isBoundBoolean = !!result;
      expect(isBoundBoolean).to.be.true;
    });
  });
});
