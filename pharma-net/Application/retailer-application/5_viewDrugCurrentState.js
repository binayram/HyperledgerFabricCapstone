'use strict';

/**
 * This is a Node.JS application to view a property registered on the network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let propertyID = args[0].toString();*/

async function viewDrugCurrentState(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to view a property on the Network');
		const viewDrugCurrentStateBuffer = await pharmanetContract.submitTransaction('viewDrugCurrentState', drugName, serialNo);
		if(!helper.isEmptyObject(viewDrugCurrentStateBuffer)){
			return null
		}
		// process response
		console.log('.....Processing View Property Transaction Response \n\n');
		let viewDrugCurrentState = JSON.parse(viewDrugCurrentStateBuffer.toString());
		console.log(viewDrugCurrentState);
		console.log('\n\n.....View Property Transaction Complete!');
		return viewDrugCurrentState;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*main(propertyID).then(() => {
	console.log('View Property Submitted on the Network');
});*/

/* viewDrugCurrentState('Catzine', 'MAN-001').then(() => {
	console.log('View Property Submitted on the Network');
}); */


module.exports.execute = viewDrugCurrentState;
