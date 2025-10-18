import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:address", "Prints the EncryptedVoting address").setAction(async function (_args: TaskArguments, hre) {
  const { deployments } = hre;

  const deployed = await deployments.get("EncryptedVoting");

  console.log(`EncryptedVoting address is ${deployed.address}`);
});

task("task:poll-count", "Returns the number of polls")
  .addOptionalParam("address", "Optionally specify the contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedVoting");

    const contract = await ethers.getContractAt("EncryptedVoting", deployment.address);
    const count = await contract.pollCount();

    console.log(`Poll count: ${count}`);
  });

task("task:poll-metadata", "Reads poll metadata")
  .addParam("pollId", "Poll identifier")
  .addOptionalParam("address", "Optionally specify the contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const pollId = BigInt(taskArguments.pollId);
    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedVoting");

    const contract = await ethers.getContractAt("EncryptedVoting", deployment.address);

    const [creator, createdAt, optionCount] = await contract.getPollMetadata(pollId);

    console.log(`Poll ${pollId}`);
    console.log(`  creator     : ${creator}`);
    console.log(`  createdAt   : ${createdAt}`);
    console.log(`  optionCount : ${optionCount}`);
  });
