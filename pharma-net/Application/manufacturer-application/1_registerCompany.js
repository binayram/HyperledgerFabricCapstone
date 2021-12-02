'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');




async function registerCompany(companyCRN, companyName, location, organisationRole) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		//const pharmanetContract = await getContractInstance();
		
		console.log('.....Requesting to create a New company on the Network');
		console.log('companyCRN '+companyCRN +' companyName '+ companyName+ ' location '+location +' organisationRole '+ organisationRole);
		const newCompanyBuffer = await pharmanetContract.submitTransaction('registerCompany', companyCRN, companyName,location, organisationRole);
		if(!helper.isEmptyObject(newCompanyBuffer)){
			return null
		}		
		// process response
		console.log('.....Processing Approve New User Transaction Response \n\n');
		let newCompany = JSON.parse(newCompanyBuffer.toString());
		
		console.log(newCompany);
		console.log('\n\n.....Approve New company Transaction Complete!');
		return newCompany;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		console.log('.....Disconnecting from Fabric Gateway');
		helper.disconnect();

	}
}
/* registerCompany('007', 'Novartis', 'Hydarabad', 'Manufacturer').then(() => {
	console.log('Approve New User Submitted on the Network');
});
 */

module.exports.execute = registerCompany;
