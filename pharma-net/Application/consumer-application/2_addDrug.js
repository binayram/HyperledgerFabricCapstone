'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/

async function addDrug(drugName, serialNo, mfgDate, expDate, companyCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a New Drug on the Network');
		const newDrugBuffer = await pharmanetContract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN);
		if(!helper.isEmptyObject(newDrugBuffer)){
			return null
		}	
		// process response
		console.log('.....Processing Approve New Drug Transaction Response \n\n');
		let newDrug = JSON.parse(newDrugBuffer.toString());
		console.log(newDrug);
		console.log('\n\n.....Approve New Drug Transaction Complete!');
		return newDrug;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*addDrug(drugName, serialNo, mfgDate, expDate, companyCRN).then(() => {
	console.log('Approve New User Submitted on the Network');
});*/
/* addDrug('Catzine','MAN-003','Jan-2020','Dec-2020','001').then(() => {
	console.log('Approve New User Submitted on the Network');
});
 */
module.exports.execute = addDrug;
