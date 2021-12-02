'use strict';

/**
 * This is a Node.JS application to View a User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/


async function createShipment(buyerCRN, drugName, listOfAssets, transporterCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a New User on the Network');
		const createShipmentBuffer = await pharmanetContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);
		if(!helper.isEmptyObject(createShipmentBuffer)){
			return null
		}	
		// process response
		console.log('.....Processing View User Transaction Response \n\n');
		let createShipment = JSON.parse(createShipmentBuffer.toString());
		console.log(createShipment);
		console.log('\n\n.....View User Transaction Complete!');
		return createShipment;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*main(name, aadharNo).then(() => {
	console.log('View User Request Submitted on the Network');
});*/

/* createShipment('002', 'Catzine', 'MAN-001|MAN-002|MAN-003', '003').then(() => {
	console.log('View User Request Submitted on the Network');
}); */

module.exports.execute = createShipment;
