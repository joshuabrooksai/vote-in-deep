import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, fhevm } from "hardhat";
import { EncryptedVoting } from "../types";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("EncryptedVotingSepolia", function () {
  let contract: EncryptedVoting;
  let contractAddress: string;
  let signers: Signers;

  before(async function () {
    if (fhevm.isMock) {
      console.warn("This hardhat test suite can only run on Sepolia Testnet");
      this.skip();
    }

    try {
      const deployment = await deployments.get("EncryptedVoting");
      contractAddress = deployment.address;
      contract = await ethers.getContractAt("EncryptedVoting", deployment.address);
    } catch (error) {
      (error as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw error;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  it("reads poll metadata when available", async function () {
    const count = await contract.pollCount();
    expect(count).to.be.gte(0n);

    if (count === 0n) {
      return;
    }

    const metadata = await contract.getPollMetadata(0);
    expect(metadata.createdAt).to.be.gt(0);
  });
});
