import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { EncryptedVoting, EncryptedVoting__factory } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("EncryptedVoting")) as EncryptedVoting__factory;
  const contract = (await factory.deploy()) as EncryptedVoting;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("EncryptedVoting", function () {
  let signers: Signers;
  let contract: EncryptedVoting;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  async function createPoll() {
    const encryptedKey = await fhevm
      .createEncryptedInput(contractAddress, signers.deployer.address)
      .addAddress(signers.deployer.address)
      .encrypt();

    const encryptedTitle = ethers.hexlify(ethers.toUtf8Bytes("encrypted-title"));
    const encryptedOptions = [
      ethers.hexlify(ethers.toUtf8Bytes("option-a")),
      ethers.hexlify(ethers.toUtf8Bytes("option-b")),
      ethers.hexlify(ethers.toUtf8Bytes("option-c")),
    ];

    await contract
      .connect(signers.deployer)
      .createPoll(encryptedTitle, encryptedOptions, encryptedKey.handles[0], encryptedKey.inputProof);
  }

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This hardhat test suite cannot run on Sepolia Testnet");
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  it("creates polls with encrypted payloads", async function () {
    await createPoll();

    const count = await contract.pollCount();
    expect(count).to.equal(1n);

    const metadata = await contract.getPollMetadata(0);
    expect(metadata.creator).to.equal(signers.deployer.address);
    expect(metadata.createdAt).to.be.gt(0);
    expect(metadata.optionCount).to.equal(3n);

    const pollData = await contract.getEncryptedPollData(0);
    expect(pollData.encryptedTitle).to.equal(ethers.hexlify(ethers.toUtf8Bytes("encrypted-title")));
    expect(pollData.encryptedOptions).to.have.length(3);
    expect(pollData.encryptedOptions[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("option-a")));
    expect(await contract.hasKeyAccess(0, signers.deployer.address)).to.equal(true);

    const counts = await contract.getEncryptedVoteCounts(0);
    expect(counts).to.have.length(3);

    const clearCount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      counts[0],
      contractAddress,
      signers.deployer,
    );
    expect(clearCount).to.equal(0);
  });

  it("manages key sharing and encrypted voting", async function () {
    await createPoll();

    await expect(
      contract.connect(signers.alice).grantKeyAccess(0, signers.bob.address),
    ).to.be.revertedWithCustomError(contract, "Unauthorized");

    await expect(contract.grantKeyAccess(0, ethers.ZeroAddress)).to.be.revertedWithCustomError(
      contract,
      "ZeroAddress",
    );

    await contract.grantKeyAccess(0, signers.bob.address);
    expect(await contract.hasKeyAccess(0, signers.bob.address)).to.equal(true);

    const countsBefore = await contract.getEncryptedVoteCounts(0);
    const clearBefore = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      countsBefore[0],
      contractAddress,
      signers.bob,
    );
    expect(clearBefore).to.equal(0);

    const votePayload = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(0)
      .encrypt();

    await contract
      .connect(signers.alice)
      .submitVote(0, votePayload.handles[0], votePayload.inputProof);

    expect(await contract.hasVoted(0, signers.alice.address)).to.equal(true);

    const countsAfter = await contract.getEncryptedVoteCounts(0);
    const firstOptionCount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      countsAfter[0],
      contractAddress,
      signers.deployer,
    );
    expect(firstOptionCount).to.equal(1);

    const firstOptionForBob = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      countsAfter[0],
      contractAddress,
      signers.bob,
    );
    expect(firstOptionForBob).to.equal(1);

    await expect(contract.grantKeyAccess(0, signers.bob.address)).to.be.revertedWithCustomError(
      contract,
      "DuplicateAccess",
    );

    const anotherPayload = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(0)
      .encrypt();

    await expect(
      contract.connect(signers.alice).submitVote(0, anotherPayload.handles[0], anotherPayload.inputProof),
    ).to.be.revertedWithCustomError(contract, "AlreadyVoted");
  });
});
