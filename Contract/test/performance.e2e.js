const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivateSale Performance E2E Test", function () {
  let privateSale;
  let invitation;
  let usdt;
  let owner, user1, user2, user3, user4, user5;

  beforeEach(async function () {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy mock USDT
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdt = await MockERC20.deploy("Tether USD", "USDT", 18);

    // Deploy Invitation contract
    const Invitation = await ethers.getContractFactory("Invitation");
    invitation = await Invitation.deploy();

    // Deploy PrivateSale contract
    const PrivateSale = await ethers.getContractFactory("PrivateSale");
    privateSale = await PrivateSale.deploy(usdt.target, invitation.target);

    // Mint USDT to users
    await usdt.mint(user1.address, ethers.parseEther("10000"));
    await usdt.mint(user2.address, ethers.parseEther("10000"));
    await usdt.mint(user3.address, ethers.parseEther("10000"));
    await usdt.mint(user4.address, ethers.parseEther("10000"));
    await usdt.mint(user5.address, ethers.parseEther("10000"));
  });

  it("Full scenario test: multi-level invitation chain with multiple purchases", async function () {
    const ROOT_ADDRESS = await invitation.ROOT_ADDRESS();

    console.log("=== Step 1: Create 5-level invitation chain ===");
    console.log("Chain: ROOT → user1 → user2 → user3 → user4 → user5");

    await invitation.connect(user1).bind(ROOT_ADDRESS);
    await invitation.connect(user2).bind(user1.address);
    await invitation.connect(user3).bind(user2.address);
    await invitation.connect(user4).bind(user3.address);
    await invitation.connect(user5).bind(user4.address);

    // Verify invitation chain
    expect(await invitation.inviter(user1.address)).to.equal(ROOT_ADDRESS);
    expect(await invitation.inviter(user2.address)).to.equal(user1.address);
    expect(await invitation.inviter(user3.address)).to.equal(user2.address);
    expect(await invitation.inviter(user4.address)).to.equal(user3.address);
    expect(await invitation.inviter(user5.address)).to.equal(user4.address);

    console.log("✅ Invitation chain created successfully");

    console.log("\n=== Step 2: Make multiple purchases ===");

    // User5 buys 1000 USDT
    await usdt.connect(user5).approve(privateSale.target, ethers.parseEther("1000"));
    await privateSale.connect(user5).subscribe(ethers.parseEther("1000"));
    console.log("✅ user5 purchased 1000 USDT");

    // User4 buys 500 USDT
    await usdt.connect(user4).approve(privateSale.target, ethers.parseEther("500"));
    await privateSale.connect(user4).subscribe(ethers.parseEther("500"));
    console.log("✅ user4 purchased 500 USDT");

    // User3 buys 700 USDT
    await usdt.connect(user3).approve(privateSale.target, ethers.parseEther("700"));
    await privateSale.connect(user3).subscribe(ethers.parseEther("700"));
    console.log("✅ user3 purchased 700 USDT");

    // User2 buys 300 USDT
    await usdt.connect(user2).approve(privateSale.target, ethers.parseEther("300"));
    await privateSale.connect(user2).subscribe(ethers.parseEther("300"));
    console.log("✅ user2 purchased 300 USDT");

    // User1 buys 1000 USDT
    await usdt.connect(user1).approve(privateSale.target, ethers.parseEther("1000"));
    await privateSale.connect(user1).subscribe(ethers.parseEther("1000"));
    console.log("✅ user1 purchased 1000 USDT");

    console.log("\n=== Step 3: Verify performance statistics ===");

    // User1's performance: user2(300) + user3(700) + user4(500) + user5(1000) = 2500
    const perf1 = await privateSale.getUserPerformance(user1.address);
    console.log(`user1 performance: ${ethers.formatEther(perf1)} USDT`);
    expect(perf1).to.equal(ethers.parseEther("2500"));

    // User2's performance: user3(700) + user4(500) + user5(1000) = 2200
    const perf2 = await privateSale.getUserPerformance(user2.address);
    console.log(`user2 performance: ${ethers.formatEther(perf2)} USDT`);
    expect(perf2).to.equal(ethers.parseEther("2200"));

    // User3's performance: user4(500) + user5(1000) = 1500
    const perf3 = await privateSale.getUserPerformance(user3.address);
    console.log(`user3 performance: ${ethers.formatEther(perf3)} USDT`);
    expect(perf3).to.equal(ethers.parseEther("1500"));

    // User4's performance: user5(1000) = 1000
    const perf4 = await privateSale.getUserPerformance(user4.address);
    console.log(`user4 performance: ${ethers.formatEther(perf4)} USDT`);
    expect(perf4).to.equal(ethers.parseEther("1000"));

    // User5's performance: 0 (no invitees)
    const perf5 = await privateSale.getUserPerformance(user5.address);
    console.log(`user5 performance: ${ethers.formatEther(perf5)} USDT`);
    expect(perf5).to.equal(0);

    console.log("\n=== Step 4: Verify user own purchase amounts ===");

    expect(await privateSale.getUserTotalAmount(user1.address)).to.equal(ethers.parseEther("1000"));
    expect(await privateSale.getUserTotalAmount(user2.address)).to.equal(ethers.parseEther("300"));
    expect(await privateSale.getUserTotalAmount(user3.address)).to.equal(ethers.parseEther("700"));
    expect(await privateSale.getUserTotalAmount(user4.address)).to.equal(ethers.parseEther("500"));
    expect(await privateSale.getUserTotalAmount(user5.address)).to.equal(ethers.parseEther("1000"));

    console.log("✅ All purchase amounts verified");

    console.log("\n=== Step 5: Verify total raised ===");
    const totalRaised = await privateSale.totalRaised();
    console.log(`Total raised: ${ethers.formatEther(totalRaised)} USDT`);
    expect(totalRaised).to.equal(ethers.parseEther("3500")); // 1000+500+700+300+1000

    console.log("\n🎉 E2E test completed successfully! All performance statistics are correct.");
  });
});
