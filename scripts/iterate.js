const Controller = artifacts.require("Controller");

module.exports = async function (callback) {
    try {
        // Get the deployed instance of Controller
        const controller = await Controller.deployed();
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        // Ensure at least one account is available
        if (accounts.length === 0) {
            throw new Error("No accounts available");
        }

        // Call the iterateAll function
        let account = accounts[0];
        console.log('Calling iterateAll function 100 times from account:', account);
        await controller.iterateAll({from: account});
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // console.log('Called 20/100');
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // console.log('Called 40/100');
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // console.log('Called 60/100');
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // console.log('Called 80/100');
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // await controller.iterateAll({ from: account });
        // console.log('Called iterateAll function successfully. (100 times)');
        //
        callback();
    } catch (error) {
        console.error('Error calling iterateAll:', error);
        callback(error);
    }

};
