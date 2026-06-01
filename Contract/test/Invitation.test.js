const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Invitation Contract", function () {
  let invitation;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  const ROOT_ADDRESS = "0xE2CE73BF4776970a0C6E58F658929B125d749483";

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const Invitation = await ethers.getContractFactory("Invitation");
    invitation = await Invitation.deploy();
  });

  describe("Binding", function () {
    it("Should bind to root address", async function () {
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      expect(await invitation.isBound(addr1.address)).to.be.true;
      expect(await invitation.getInviter(addr1.address)).to.equal(ROOT_ADDRESS);
    });

    it("Should bind to already bound address", async function () {
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      await invitation.connect(addr2).bind(addr1.address);

      expect(await invitation.isBound(addr2.address)).to.be.true;
      expect(await invitation.getInviter(addr2.address)).to.equal(addr1.address);

      const invitees = await invitation.getInvitees(addr1.address);
      expect(invitees.length).to.equal(1);
      expect(invitees[0]).to.equal(addr2.address);
    });

    it("Should fail if inviter is zero address", async function () {
      await expect(invitation.connect(addr1).bind(ethers.ZeroAddress)).to.be.revertedWith(
        "Invitation: invalid inviter"
      );
    });

    it("Should fail if already bound", async function () {
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      await expect(invitation.connect(addr1).bind(addr2.address)).to.be.revertedWith(
        "Invitation: already bound"
      );
    });

    it("Should fail if inviter is not root and not bound", async function () {
      await expect(invitation.connect(addr1).bind(addr2.address)).to.be.revertedWith(
        "Invitation: inviter not bound"
      );
    });

    it("Should emit Bind event", async function () {
      await expect(invitation.connect(addr1).bind(ROOT_ADDRESS))
        .to.emit(invitation, "Bind")
        .withArgs(addr1.address, ROOT_ADDRESS);
    });
  });

  describe("Queries", function () {
    beforeEach(async function () {
      await invitation.connect(addr1).bind(ROOT_ADDRESS);
      await invitation.connect(addr2).bind(addr1.address);
      await invitation.connect(addr3).bind(addr1.address);
    });

    it("Should return correct inviter", async function () {
      expect(await invitation.getInviter(addr1.address)).to.equal(ROOT_ADDRESS);
      expect(await invitation.getInviter(addr2.address)).to.equal(addr1.address);
    });

    it("Should return correct invitees list", async function () {
      const invitees = await invitation.getInvitees(addr1.address);
      expect(invitees.length).to.equal(2);
      expect(invitees[0]).to.equal(addr2.address);
      expect(invitees[1]).to.equal(addr3.address);
    });

    it("Should return correct invitee count", async function () {
      expect(await invitation.getInviteeCount(addr1.address)).to.equal(2);
      expect(await invitation.getInviteeCount(addr2.address)).to.equal(0);
    });

    it("Should return correct bound status", async function () {
      expect(await invitation.isBound(addr1.address)).to.be.true;
      expect(await invitation.isBound(addr3.address)).to.be.true;
      expect(await invitation.isBound(owner.address)).to.be.false;
    });
  });
});
