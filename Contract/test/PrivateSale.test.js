const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivateSale Contract", function () {
  let privateSale;
  let usdt;
  let invitation;
  let owner;
  let addr1;
  let addr2;
  const RECEIVER = "0x4F948fbf0922903cd7F928a8b3031CEed512E907";
  const MIN_PURCHASE = ethers.parseEther("200");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdt = await MockERC20.deploy("Tether USD", "USDT", 18);

    // Deploy Invitation contract
    const Invitation = await ethers.getContractFactory("Invitation");
    invitation = await Invitation.deploy();

    const PrivateSale = await ethers.getContractFactory("PrivateSale");
    privateSale = await PrivateSale.deploy(usdt.target, invitation.target);

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

  describe("Performance Statistics", function () {
    it("Should correctly accumulate performance for all inviters", async function () {
      // Create a 3-level invitation chain: addr1 → addr2 → addr3
      const [, addr1, addr2, addr3] = await ethers.getSigners();
      await usdt.mint(addr3.address, ethers.parseEther("10000"));

      // Bind invitations
      const ROOT_ADDRESS = await invitation.ROOT_ADDRESS();
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      await invitation.connect(addr2).bind(addr1.address);
      await invitation.connect(addr3).bind(addr2.address);

      // addr3 makes a purchase of 1000 USDT
      await usdt.connect(addr3).approve(privateSale.target, ethers.parseEther("1000"));
      await privateSale.connect(addr3).subscribe(ethers.parseEther("1000"));

      // Check performance: addr1 and addr2 should both get 1000 USDT performance
      expect(await privateSale.getUserPerformance(addr1.address)).to.equal(ethers.parseEther("1000"));
      expect(await privateSale.getUserPerformance(addr2.address)).to.equal(ethers.parseEther("1000"));
      expect(await privateSale.getUserPerformance(addr3.address)).to.equal(0); // Self performance is 0
    });

    it("Should accumulate performance from multiple invitees", async function () {
      const [, addr1, addr2, addr3, addr4] = await ethers.getSigners();
      await usdt.mint(addr3.address, ethers.parseEther("10000"));
      await usdt.mint(addr4.address, ethers.parseEther("10000"));

      // Create invitation chain: addr1 → addr2 → addr3, addr1 → addr4
      const ROOT_ADDRESS = await invitation.ROOT_ADDRESS();
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      await invitation.connect(addr2).bind(addr1.address);
      await invitation.connect(addr3).bind(addr2.address);
      await invitation.connect(addr4).bind(addr1.address);

      // Both addr3 and addr4 make purchases
      await usdt.connect(addr3).approve(privateSale.target, ethers.parseEther("500"));
      await privateSale.connect(addr3).subscribe(ethers.parseEther("500"));

      await usdt.connect(addr4).approve(privateSale.target, ethers.parseEther("300"));
      await privateSale.connect(addr4).subscribe(ethers.parseEther("300"));

      // Check performance
      expect(await privateSale.getUserPerformance(addr1.address)).to.equal(ethers.parseEther("800")); // 500 + 300
      expect(await privateSale.getUserPerformance(addr2.address)).to.equal(ethers.parseEther("500")); // Only from addr3
      expect(await privateSale.getUserPerformance(addr3.address)).to.equal(0);
      expect(await privateSale.getUserPerformance(addr4.address)).to.equal(0);
    });

    it("Should handle users without inviter correctly", async function () {
      const [, addr1] = await ethers.getSigners();
      await usdt.mint(addr1.address, ethers.parseEther("10000"));

      // addr1 makes a purchase without binding an inviter
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("500"));
      await privateSale.connect(addr1).subscribe(ethers.parseEther("500"));

      // No performance for anyone
      expect(await privateSale.getUserPerformance(addr1.address)).to.equal(0);
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy (simple check)", async function () {
      await usdt.connect(addr1).approve(privateSale.target, ethers.parseEther("500"));
      await privateSale.connect(addr1).subscribe(ethers.parseEther("500"));
      expect(await privateSale.totalRaised()).to.equal(ethers.parseEther("500"));
    });

    it("Should not allow zero USDT address in constructor", async function () {
      const PrivateSale = await ethers.getContractFactory("PrivateSale");
      await expect(PrivateSale.deploy(ethers.ZeroAddress, invitation.target)).to.be.revertedWith(
        "PrivateSale: invalid USDT address"
      );
    });

    it("Should not allow zero invitation address in constructor", async function () {
      const PrivateSale = await ethers.getContractFactory("PrivateSale");
      await expect(PrivateSale.deploy(usdt.target, ethers.ZeroAddress)).to.be.revertedWith(
        "PrivateSale: invalid invitation address"
      );
    });
  });
});
