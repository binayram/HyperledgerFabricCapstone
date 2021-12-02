'use strict';

/**
 * This is a Node.JS application to approve a new property to be registered on the network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let propertyID = args[0].toString();*/

async function viewHistory(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Registering a new property on the Network');
		const viewHistoryBuffer = await pharmanetContract.submitTransaction('viewHistory', drugName, serialNo);
		if(!helper.isEmptyObject(viewHistoryBuffer)){
			return null
		}
		// process response
		console.log('.....Processing View User Transaction Response \n\n');
		let viewHistory = JSON.parse(viewHistoryBuffer.toString());
		console.log(viewHistory);
		console.log('\n\n.....View User Transaction Complete!');
		return viewHistory;
	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*main(propertyID).then(() => {
	console.log('Approve Property Registration Submitted on the Network');
});*/

/* viewHistory('Catzine', 'MAN-001').then(() => {
	console.log('Approve Property Registration Submitted on the Network');
});
 */
module.exports.execute = viewHistory;
