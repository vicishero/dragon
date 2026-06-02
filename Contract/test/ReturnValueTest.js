const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Return Value Analysis", function () {
  let invitation;
  let owner;
  let addr1;
  const ROOT_ADDRESS = "0xE2CE73BF4776970a0C6E58F658929B125d749483";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Invitation = await ethers.getContractFactory("Invitation");
    invitation = await Invitation.deploy();
  });

  describe("isBound return value details", function () {
    it("Should analyze false return value", async function () {
      const result = await invitation.isBound(addr1.address);

      console.log("\n--- isBound = false ---");
      console.log("Result:", result);
      console.log("Type:", typeof result);
      console.log("result === false:", result === false);
      console.log("Boolean(result):", Boolean(result));
      console.log("!!result:", !!result);

      expect(result).to.be.false;
    });

    it("Should analyze true return value", async function () {
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      const result = await invitation.isBound(addr1.address);

      console.log("\n--- isBound = true ---");
      console.log("Result:", result);
      console.log("Type:", typeof result);
      console.log("result === true:", result === true);
      console.log("Boolean(result):", Boolean(result));
      console.log("!!result:", !!result);

      expect(result).to.be.true;
    });

    it("Should test ABI compatibility", async function () {
      // 模拟前端使用的 ABI 片段
      const abiFragment = [
        {
          "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
          "name": "isBound",
          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      const contractAddress = await invitation.getAddress();

      // 使用精简 ABI 创建合约实例
      const minimalContract = await ethers.getContractAt(abiFragment, contractAddress);

      const result1 = await minimalContract.isBound(addr1.address);
      const result2 = await minimalContract.isBound(owner.address);

      console.log("\n--- Minimal ABI test ---");
      console.log("Bound address result:", result1, typeof result1);
      console.log("Unbound address result:", result2, typeof result2);

      expect(result1).to.be.true;
      expect(result2).to.be.false;
    });

    it("Should test all query functions", async function () {
      await invitation.connect(addr1).bind(ROOT_ADDRESS);

      console.log("\n--- All query functions ---");

      const isBoundResult = await invitation.isBound(addr1.address);
      console.log("isBound:", isBoundResult, typeof isBoundResult);

      const getInviterResult = await invitation.getInviter(addr1.address);
      console.log("getInviter:", getInviterResult, typeof getInviterResult);

      const rootResult = await invitation.ROOT_ADDRESS();
      console.log("ROOT_ADDRESS:", rootResult, typeof rootResult);

      expect(isBoundResult).to.be.true;
      expect(getInviterResult).to.equal(ROOT_ADDRESS);
    });
  });
});
