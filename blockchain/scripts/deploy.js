const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "MATIC");

  const MSMEToken = await hre.ethers.getContractFactory("MSMEToken");
  
  const token = await MSMEToken.deploy(
    "Sharma Tea Token", "STT",
    "Sharma Tea & Snacks", "food_beverage",
    "Indore", "23AADCS1234F1ZH",
    hre.ethers.parseEther("0.1"),
    8, 2015, "QmExample123",
    hre.ethers.parseEther("0.001"),
    deployer.address,
    deployer.address,
    { gasLimit: 3000000, gasPrice: hre.ethers.parseUnits("25", "gwei") }
  );

  await token.waitForDeployment();
  const address = await token.getAddress();
  console.log("✅ MSMEToken deployed to:", address);
  console.log("Polygonscan:", `https://amoy.polygonscan.com/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});