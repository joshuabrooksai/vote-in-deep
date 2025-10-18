import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedEncryptedVoting = await deploy("EncryptedVoting", {
    from: deployer,
    log: true,
  });

  console.log(`EncryptedVoting contract: `, deployedEncryptedVoting.address);
};
export default func;
func.id = "deploy_encrypted_voting"; // id required to prevent reexecution
func.tags = ["EncryptedVoting"];
