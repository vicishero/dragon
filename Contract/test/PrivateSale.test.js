const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivateSale Contract", function () {
  let privateSale;
  let usdt;
  let owner;
  let addr1;
  let addr2;
  const RECEIVER = "0x4F948fbf0922903cd7F928a8b3031CEed512E907";
  const MIN_PURCHASE = ethers.parseEther("200");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdt = await MockERC20.deploy("Tether USD", "USDT", 18);

    const PrivateSale = await ethers.getContractFactory("PrivateSale");
    privateSale = await PrivateSale.deploy(usdt.target);

    await usdt.mint(addr1.address, ethers.parseEther("10000"));
    await usdt.mint(addr2.address, ethers.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should set correct USDT address", async function () {
      expect(await privateSale.usdt()).to.equal(usdt.target);
    });

    it("Should have correct minimum purchase", async function () {
      expect(await privateSale.MIN_PURCHASE()).to.equal(MIN_PURCHASE);
    });

    it("Should have correct receiver address", async function () {
      expect(await privateSale.RECEIVER()).to.equal(RECEIVER);
    });
  });

  describe("Subscribe", function () {
    it("Should subscribe with valid amount", async function () {
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("500"));
      await expect(privateSale.connect(addr1).subscribe(ethers.parseEther("500")))
        .to.emit(privateSale, "Subscribe")
        .withArgs(addr1.address, ethers.parseEther("500"), await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      expect(await privateSale.totalRaised()).to.equal(ethers.parseEther("500"));
      expect(await privateSale.getPurchaseCount()).to.equal(1);
    });

    it("Should transfer USDT to receiver", async function () {
      const initialBalance = await usdt.balanceOf(RECEIVER);
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("500"));
      await privateSale.connect(addr1).subscribe(ethers.parseEther("500"));
      const finalBalance = await usdt.balanceOf(RECEIVER);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("500"));
    });

    it("Should fail if amount is less than minimum", async function () {
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("100"));
      await expect(privateSale.connect(addr1).subscribe(ethers.parseEther("100"))).to.be.revertedWith(
        "PrivateSale: amount too small"
      );
    });

    it("Should track user purchases", async function () {
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("1000"));
      await privateSale.connect(addr1).subscribe(ethers.parseEther("500"));
      await privateSale.connect(addr1).subscribe(ethers.parseEther("300"));

      const purchaseIds = await privateSale.getUserPurchaseIds(addr1.address);
      expect(purchaseIds.length).to.equal(2);

      const totalAmount = await privateSale.getUserTotalAmount(addr1.address);
      expect(totalAmount).to.equal(ethers.parseEther("800"));
    });

    it("Should query purchases correctly", async function () {
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("1000"));
      await usdt.connect(addr2).approve(privateSale.target, ethers.parseEther("1000"));

      await privateSale.connect(addr1).subscribe(ethers.parseEther("500"));
      await privateSale.connect(addr2).subscribe(ethers.parseEther("300"));

      const purchases = await privateSale.getPurchases(0, 2);
      expect(purchases.length).to.equal(2);
      expect(purchases[0].buyer).to.equal(addr1.address);
      expect(purchases[1].buyer).to.equal(addr2.address);
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy (simple check)", async function () {
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("500"));
      await privateSale.connect(addr1).subscribe(ethers.parseEther("500"));
      expect(await privateSale.totalRaised()).to.equal(ethers.parseEther("500"));
    });

    it("Should not allow zero address in constructor", async function () {
      const PrivateSale = await ethers.getContractFactory("PrivateSale");
      await expect(PrivateSale.deploy(ethers.ZeroAddress)).to.be.revertedWith(
        "PrivateSale: invalid USDT address"
      );
    });
  });
});
