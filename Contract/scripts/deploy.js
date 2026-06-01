const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy Invitation Contract
  console.log("\nDeploying Invitation contract...");
  const Invitation = await ethers.getContractFactory("Invitation");
  const invitation = await Invitation.deploy();
  await invitation.waitForDeployment();
  console.log("Invitation contract deployed to:", await invitation.getAddress());

  // Deploy PrivateSale Contract - need USDT address
  console.log("\nDeploying PrivateSale contract...");
  console.log("Please replace USDT_ADDRESS with actual USDT contract address on BSC");
  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B319795555555"; // BSC USDT address (example - replace with real one)

  const PrivateSale = await ethers.getContractFactory("PrivateSale");
  const privateSale = await PrivateSale.deploy(USDT_ADDRESS);
  await privateSale.waitForDeployment();
  console.log("PrivateSale contract deployed to:", await privateSale.getAddress());

  console.log("\n✅ Deployment completed!");
  console.log("Invitation:", await invitation.getAddress());
  console.log("PrivateSale:", await privateSale.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
