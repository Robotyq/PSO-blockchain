// Same imports
const Web3 = require('web3');
artifacts.require("Controller");
module.exports = async function (deployer, network, accounts) {
    const web3 = new Web3(deployer.provider);
    // Print the ETH balance of the first 4 accounts
    for (let i = 0; i < 6; i++) {
        const balance = await web3.eth.getBalance(accounts[i]);
        console.log(`Account ${i} (${accounts[i]}) balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    }
};
