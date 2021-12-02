'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/

async function createPO(buyerCRN, sellerCRN, drugName, quantity) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a New Drug on the Network');
		const createPOBuffer = await pharmanetContract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName, quantity);
		if(!helper.isEmptyObject(createPOBuffer)){
			return null
		}	
		// process response
		console.log('.....Processing Approve New Drug Transaction Response \n\n');
		let createPO = JSON.parse(createPOBuffer.toString());
		console.log(createPO);
		console.log('\n\n.....Approve New Drug Transaction Complete!');
		return createPO;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*createPO(buyerCRN, sellerCRN, drugName, quantity).then(() => {
	console.log('Approve New User Submitted on the Network');
});*/
/* createPO("002", "001", 'Catzine', '3').then(() => {
	console.log('Approve New User Submitted on the Network');
}); */



module.exports.execute = createPO;
