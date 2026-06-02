const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  console.log("\nDeploying Invitation contract...");
  const Invitation = await ethers.getContractFactory("Invitation");
  const invitation = await Invitation.deploy();
  await invitation.waitForDeployment();
  console.log("Invitation contract deployed to:", await invitation.getAddress());

  console.log("\n✅ Deployment completed!");
  console.log("Invitation:", await invitation.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
