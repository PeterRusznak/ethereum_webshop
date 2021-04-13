async function main() {

    const [deployer, buyer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const daiFactory = await ethers.getContractFactory("Dai");
    const daiContract = await daiFactory.deploy();
    console.log("Dai Contract address:", daiContract.address);

    await daiContract.faucet(buyer.address, ethers.utils.parseEther('5000'));
    const balance = await daiContract.balanceOf(buyer.address)
    console.log("Buyer's DAI balance:", ethers.utils.formatEther(balance))

    const ppFactory = await ethers.getContractFactory("PaymentProcessor");
    const paymentProcessor = await ppFactory.deploy(deployer.address, daiContract.address);
    console.log("PaymentProcessor's Address", paymentProcessor.address)

    console.log("Shop Owner's Address", deployer.address)
    console.log("Buyer Address", buyer.address)




}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
