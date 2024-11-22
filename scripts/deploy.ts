import { ethers } from "hardhat";

async function main() {
  const SubscriptionContract = await ethers.getContractFactory("SubscriptionContract");
  const subscription = await SubscriptionContract.deploy();

  await subscription.waitForDeployment();

  console.log(
    `SubscriptionContract deployed to ${await subscription.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
