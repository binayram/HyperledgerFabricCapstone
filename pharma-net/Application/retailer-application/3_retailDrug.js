'use strict';

/**
 * This is a Node.JS application to View a User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/


async function retailDrug(drugName, serialNo, retailerCRN, customerAadhar) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a New User on the Network');
		const retailDrugBuffer = await pharmanetContract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar);
		if(!helper.isEmptyObject(retailDrugBuffer)){
			return null
		}	
		// process response
		console.log('.....Processing View User Transaction Response \n\n');
		let retailDrug = JSON.parse(retailDrugBuffer.toString());
		console.log(retailDrug);
		console.log('\n\n.....View User Transaction Complete!');
		return retailDrug;

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
/* retailDrug('Catzine', 'MAN-001', '004', '898989898989').then(() => {
	console.log('View User Request Submitted on the Network');
}); */



module.exports.execute = retailDrug;
