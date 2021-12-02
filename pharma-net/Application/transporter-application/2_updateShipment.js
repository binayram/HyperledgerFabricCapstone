'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/

async function updateShipment(buyerCRN, drugName, transporterCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a New Drug on the Network');
		const shipmentBuffer = await pharmanetContract.submitTransaction('updateShipment', buyerCRN, drugName, transporterCRN);
		if(!helper.isEmptyObject(shipmentBuffer)){
			return null
		}
		// process response
		console.log('.....Processing Approve New Drug Transaction Response \n\n');
		let updateShipment = JSON.parse(shipmentBuffer.toString());
		console.log(updateShipment);
		console.log('\n\n.....Approve New Drug Transaction Complete!');
		return updateShipment;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*main(buyerCRN, drugName, transporterCRN).then(() => {
	console.log('Approve New User Submitted on the Network');
});*/

/* updateShipment('004','Catzine','003').then(() => {
	console.log('Approve New User Submitted on the Network');
});
 */
module.exports.execute = updateShipment;
