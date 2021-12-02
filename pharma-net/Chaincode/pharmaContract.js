'use strict';

const {
	Contract
} = require('fabric-contract-api');
const utilsclass = require('./utils.js');
class pharmaContract extends Contract {



	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.pharma-network.pharmanet');
		global.utils = new utilsclass();
		global.manufacturerOrg = 'manufacturer.pharma-network.com';
		global.distributorOrg = 'distributor.pharma-network.com';
		global.retailerOrg = 'retailer.pharma-network.com';
		global.consumerOrg = 'consumer.pharma-network.com';
		global.transporterOrg = 'transporter.pharma-network.com';
	}




	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Pharmanet Smart Contract Instantiated');
	}

	/**
	 * Create a request to Add a company on the network
	 * @param ctx - The transaction Context object
	 * @param companyCRN - companyCRN is a unique identification number allotted to all the registered companies
	 * @param companyName - Name of the company
	 * @param location - location of the company
	 * @param organisationRole - organisationRole in the network
	 */
	async registerCompany(ctx, companyCRN, companyName, location, organisationRole) {
		//  hierarchy = utils.getHierarchyID(organisationRole);
		try {
			// check if initiator of the transaction is Manufacturer, Distributor, Retailer and Transporter

			if (!await utils.validateInitiatorCompanyRegistration(ctx)) {
				var initiatorID = ctx.clientIdentity.getX509Certificate();
				throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' Only Manufacturer, Distributor, Retailer and Transporter are allowed to do this transaction');
			}
			//Checking null and empty values
			if (!await utils.checkDefaultValidations(companyCRN)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(companyName)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(location)) {
				return new Error("Check Values")
			}

			if (!await utils.checkDefaultValidations(organisationRole)) {
				return new Error("Check Values")
			}

			// to get hierarchy values based on organisation role
			var hierarchy = await utils.getHierarchyID(ctx, organisationRole);
			//Checks if there is any other organisationRole other than prescribed.
			if (hierarchy.toString().includes('Error')) {
				return hierarchy;
			}
			// Create a new composite key for the new request
			console.log('hierarchy' + hierarchy);
			//Composite key to store Manufacturer composite key,
			const manufacturerKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [companyCRN]);
			// const manufacturerKey = companyCRN;
			console.log(manufacturerKey);
			let manufacturerBaseObject = {
				companyName: companyName
			}
			// put data for manufacturerBaseObject
			await utils.putData(ctx, manufacturerKey, manufacturerBaseObject);

			// Company id composite key is generated based on CompanyCRN and CompanyName
			const companyID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [companyCRN, companyName]);
			console.log('companyID ' + companyID);
			let newRequestObject = {
				companyID: companyID, //This field stores the composite key with which the company will get registered on the network
				// companyCRN: companyCRN,
				companyName: companyName, // Name of the company
				location: location, //Location of the company
				organisationRole: organisationRole, // This field will take organisation role
				hierarchy: hierarchy //This field will take an integer value based on its position in the supply chain
			};
			await utils.putData(ctx, companyID, newRequestObject);
			console.log('companyIDhere ' + newRequestObject);
			// Return value of new student account created to user
			return newRequestObject;
		} catch (e) {
			console.log(e);
			return '';

		}
	}

	/**
	 * Create a request to Add drug on the network
	 * @param ctx - The transaction Context object
	 * @param companyCRN - companyCRN is a unique identification number allotted to all the registered companies
	 * @param companyName - Name of the company
	 * @param location - location of the company
	 * @param organisationRole - organisationRole in the network
	 */

	async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {
		try {
			//Validating initiator
			await utils.validateInitiator(ctx, manufacturerOrg);
			//Checking null and empty values
			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(serialNo)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(mfgDate)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(expDate)) {
				return new Error("Check Values")
			}

			console.log("here 1")
			if (companyCRN == null || companyCRN == "" || !companyCRN.includes('MAN')) {
				console.log("\n companyCRN wrong " + companyCRN)
				return new Error('companyCRN should not be empty or null or it should start from MAN');
			}
			console.log("here 2")
			//get the manufacturer name from CompanyCRN, Im maintaining this as a key value pair
			let manufacturerName = await utils.getManufacturerName(ctx, companyCRN)
			if (manufacturerName == '') {

				return new Error('Manufacturer is not available in the network');
			}
			console.log("here 3")
			// productID composite key is generated based on drugName and serialNo
			const productID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.adddrug', [drugName, serialNo]);
			const manufacturerCompositeKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [companyCRN, manufacturerName]);
			let newDrugObject = {
				productID: productID, //Product ID will store the composite key using which the product will be stored on the ledger
				name: drugName, //Name of the product
				manufacturer: manufacturerCompositeKey, //Composite key of the manufacturer used to store manufacturer’s detail on the ledger
				mfgDate: mfgDate, // Date of manufacturing of the drug
				expDate: expDate, // Expiration date of the drug
				owner: companyCRN, // Key of the drug owner(I have assumed it to be CRN value)
				shipment: null // Used to store the list of keys of all the shipment objects that will be associated with this asset. When the drug is added to the ledger, this field will store no value. 
			}
			console.log("here 4")
			await utils.putData(ctx, productID, newDrugObject);
			// Return value of new student account created to user
			return newDrugObject;
		} catch (e) {
			console.log(e);
			return '';
		}
	}

	/**
	 * Create a PO request on the network
	 * @param ctx - The transaction Context object
	 * @param buyerCRN - PO buyer CRN
	 * @param sellerCRN - PO seller CRN
	 * @param drugName - PO drugName
	 * @param quantity - PO request quantity in the network
	 */

	async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity) {
		try {
			if (!utils.validateInitiatorCreatePO(ctx)) {
				const initiatorID = ctx.clientIdentity.getX509Certificate();
				return new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' Only  Distributor and Retailer are allowed to do this transaction');
			}
			//Checking null, empty values and basic validations
			if (!await utils.checkDefaultValidations(buyerCRN)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(sellerCRN)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}
			if (quantity == null || quantity == "" || isNaN(quantity)) {
				return new Error('quantity should not be empty, null, also it should be only numbers');
			}


			// get buyer name from buyer CRN
			let buyerName = await utils.getManufacturerName(ctx, buyerCRN);
			if (buyerName == '') {
				return new Error('Buyer is not available in the network');
			}
			console.log("BuyerName" + buyerName);
			// get complete values of buyer from buyerCRN and Name
			const buyerCompositeKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [buyerCRN, buyerName]);
			console.log("buyerCompositeKey" + buyerCompositeKey);
			// get seller name from Seller CRN
			let sellerName = await utils.getManufacturerName(ctx, sellerCRN)
			console.log("sellerName" + sellerName);
			if (sellerName == '') {
				return new Error('Seller is not available in the network');
			}
			// get complete values of seller from sellerCRN and Name
			const sellerCompositeKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [sellerCRN, sellerName]);
			console.log("sellerCompositeKey" + sellerCompositeKey);

			//    if (utils.checkHirerchy(buyerCompositeKey, sellerCompositeKey)) {
			//Checks Hierarchy
			if (await utils.checkHirerchy(ctx, buyerCompositeKey, sellerCompositeKey)) {
				const poID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.purchaseOrder', [buyerCRN, drugName]);
				console.log(poID);
				let newRequestObject = {
					poID: poID, //Stores the composite key of the PO using which the PO is stored on the ledger
					drugName: drugName, //Contains the name of the drug for which the PO is raised
					quantity: quantity, //Denotes the number of units required.
					buyer: buyerCompositeKey, //Stores the composite key of the buyer.
					seller: sellerCompositeKey, //Stores the composite key of the seller of the drugs.
					buyerCRN: buyerCRN,
					sellerCRN: sellerCRN
				};
				//  await utils.putData(ctx, poID, newRequestObject);
				await utils.putData(ctx, poID, newRequestObject);
				// Return value of new student account created to user
				return newRequestObject;
			} else {
				throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');
			}
		} catch (e) {
			console.log(e);
			return '';
		}
	}

	/**
	 * Create a create Shipment request on the network
	 * @param ctx - The transaction Context object
	 * @param buyerCRN - Buyer CRN for the drug
	 * @param drugName - DrugName which is been shipped 
	 * @param listOfAssets - List of serial numbers in a string Saperated by '|' (this i have taken serial number because Composite key while passing i am unable to get buffer of the composite key, It was issuing an error 'Unexpected end of JSON input' )
	 * @param transporterCRN - CRN of the transporter in the shipment 
	 */
	async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN) {
		try {
			if (!utils.validateInitiatorCreateShipment(ctx)) {
				const initiatorID = ctx.clientIdentity.getX509Certificate();
				return new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' Only Manufacturer and Distributor are allowed to do this transaction');
			}
			//Checking null, empty values and basic validations
			if (!await utils.checkDefaultValidations(buyerCRN)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(listOfAssets)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(transporterCRN)) {
				return new Error("Check Values")
			}


			if (transporterCRN == null || transporterCRN == "") {
				return new Error('transporterCRN should not be empty or null');
			}
			// get buyer name from buyer CRN
			let buyerName = await utils.getManufacturerName(ctx, buyerCRN);
			if (buyerName == '') {
				return new Error('Buyer is not available in the network');
			}

			let transporterName = await utils.getManufacturerName(ctx, transporterCRN)
			console.log("transporterName" + transporterName);
			if (transporterName == '') {
				return new Error('transporter is not available in the network');
			}
			// get complete values of seller from sellerCRN and Name
			const transporterCompositeKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [transporterCRN, transporterName]);
			console.log("transporterCompositeKey" + transporterCompositeKey);
			//Splitting the list of assets based in '|'
			listOfAssets = listOfAssets.split("|");
			console.log("listOfAssets :" + listOfAssets);
			console.log("listOfAssetsSize :" + listOfAssets.length);
			//updating values in composite key 
			var owner = await utils. getOwner(ctx, buyerCRN, drugName);
			if (owner != '' && await utils.checkAllAssetsBelongToOwner(ctx, drugName, owner, listOfAssets)) {
				//To fetch the quantity requested in the PO
				let quantity = await utils.getQuantity(ctx, buyerCRN, drugName);
				console.log("quantity: " + quantity);
				// Checking if the Quantity requested in PO and list of assets are same
				if (quantity == listOfAssets.length) {
					//      utils.updateOwners(listOfAssets, transporterCRN, transporterCRN);
					const shipmentID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.shipment', [buyerCRN, drugName]);
					console.log("shipmentID: " + typeof shipmentID);
					await utils.updateOwners(ctx, listOfAssets, transporterCRN, transporterCompositeKey, drugName);
					console.log(shipmentID);
					let newRequestObject = {
						shipmentID: shipmentID, //Composite key of the shipment asset
						creator: buyerCRN, // Key of the creator of the transaction.
						assets: listOfAssets, // A String of the Serial No (this i have taken serial number because Composite key while passing i am unable to get buffer of the composite key, It was issuing an error 'Unexpected end of JSON input' )
						transporter: transporterCompositeKey, // The composite key of the transporter,
						status: "in-transit"
					}
					//  await utils.putData(ctx, poID, newRequestObject);
					await utils.putData(ctx, shipmentID, newRequestObject);
					// Return value of new student account created to user
					return newRequestObject;
				} else {
					throw new Error('Quantity Size dont match with list of assets ');
				}
			} else {
				throw new Error('Some of the assets may not be with the seller');
			}

		} catch (e) {
			console.log(e);
			return '';
		}
	}

	/**
	 * Update Shipment request on the network
	 * @param ctx - The transaction Context object
	 * @param buyerCRN - Buyer CRN for the drug
	 * @param drugName - DrugName which is been shipped 
	 * @param transporterCRN - CRN of the transporter in the shipment 
	 */

	async updateShipment(ctx, buyerCRN, drugName, transporterCRN) {

		//  utils.updateOwners(listOfAssets, buyerCRN);

		//await utils.updateOwners(listOfAssets, buyerCRN);
		try {

			await utils.validateInitiator(ctx, transporterOrg)
			//Checking null, empty values and basic validations

			if (!await utils.checkDefaultValidations(buyerCRN)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(transporterCRN)) {
				return new Error("Check Values")
			}

			let transporterName = await utils.getManufacturerName(ctx, transporterCRN)
			console.log("transporterName" + transporterName);
			if (transporterName == '') {
				return new Error('transporter is not available in the network');
			}
			const transporterCompositeKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [transporterCRN, transporterName]);

			const shipmentID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.shipment', [buyerCRN, drugName]);
			//to get the list of assets
			var listOfAssets = await utils.getAssetList(ctx, shipmentID);
			//var owner = await utils. getOwner(ctx, buyerCRN, drugName);
			// updating owners in every asset
		/* 	if (await utils.checkAllAssetsBelongToOwner(ctx, drugName, owner, listOfAssets)) { */
				await utils.updateOwners(ctx, listOfAssets, buyerCRN, shipmentID, drugName);
				console.log(shipmentID);
				let newRequestObject = {
					shipmentID: shipmentID, //Composite key of the shipment asset
					creator: transporterCRN, // Key of the creator of the transaction.
					assets: listOfAssets, // A String of the Serial No (this i have taken serial number because Composite key while passing i am unable to get buffer of the composite key, It was issuing an error 'Unexpected end of JSON input' )
					transporter: transporterCompositeKey, // The composite key of the transporter,
					status: "delivered" //Status changed to Deliverd
				};
				//  await utils.putData(ctx, poID, newRequestObject);
				await utils.putData(ctx, shipmentID, newRequestObject);
				// Return value of new student account created to user
				return newRequestObject;
			/* } else {
				throw new Error('Some of the assets may not be with the seller');
			} */
		} catch (e) {
			console.log(e)
			return ''
		}
	}

	/**
	 * retail drug request on the network
	 * @param ctx - The transaction Context object
	 * @param serialNo - serialNo of the drug
	 * @param drugName - DrugName which is been shipped 
	 * @param customerAadhar - Aadhar number of the customer 
	 * @param retailerCRN = retailer CRN
	 */


	async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar) {
		try {
			utils.validateInitiator(ctx, retailerOrg);
			//utils.validateInstantiator(ctx, retailerOrg);
			//Checking basic null checks
			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(serialNo)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(retailerCRN)) {
				return new Error("Check Values")
			}
			if (!await utils.checkDefaultValidations(customerAadhar, )) {
				return new Error("Check Values")
			}
			// get values from composite key
			const shipmentID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.shipment', [customerAadhar, drugName]);

			const productID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.adddrug', [drugName, serialNo]);
			let assetBuffer = await ctx.stub.getState(productID).catch(err => console.log(err));
			let assetObject = JSON.parse(assetBuffer.toString());
			//updating values in composite key 
			if (assetObject != undefined && assetObject.owner == retailerCRN) {
				//assetObject.owner = customerAadhar
				let newDrugObject = {
					productID: assetObject.productID, //Product ID will store the composite key using which the product will be stored on the ledger
					name: assetObject.drugName, //Name of the product
					manufacturer: assetObject.manufacturerCompositeKey, //Composite key of the manufacturer used to store manufacturer’s detail on the ledger
					mfgDate: assetObject.mfgDate, // Date of manufacturing of the drug
					expDate: assetObject.expDate, // Expiration date of the drug
					owner: customerAadhar, // Key of the drug owner(I have assumed it to be CRN value)
					shipment: assetObject.shipment + "|" + shipmentID // Used to store the list of keys of all the shipment objects that will be associated with this asset. When the drug is added to the ledger, this field will store no value. 
				}

				//  await utils.putData(ctx, assetkey, assetObject);
				await utils.putData(ctx, productID, newDrugObject);
				return newDrugObject;
			} else {
				throw new Error('The asset is undefined or not owned by this retailer');
			}
		} catch (e) {
			console.log(e)
			return ''
		}
	}

	/**
	 * view History drug request on the network
	 * @param ctx - The transaction Context object
	 * @param serialNo - serialNo of the drug
	 * @param drugName - DrugName which is been shipped 
	 */

	async viewHistory(ctx, drugName, serialNo) {
		var isHistory = true;
		try {

			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}

			if (!await utils.checkDefaultValidations(serialNo)) {
				return new Error("Check Values")
			}

			const key = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.adddrug', [drugName, serialNo]);
			// getting history for key
			console.info('getting history for key: ' + key);
			let iterator = await ctx.stub.getHistoryForKey(key);
			console.log('length ' + iterator)
			let allResults = [];
			//let res = await iterator.next();
			while (true) {
				let res = await iterator.next();

				if (res.value && res.value.value.toString()) {
					let jsonRes = {};
					console.log(res.value.value.toString('utf8'));

					if (isHistory && isHistory === true) {
						jsonRes.TxId = res.value.tx_id;
						jsonRes.Timestamp = res.value.timestamp;
						jsonRes.IsDelete = res.value.is_delete.toString();
						try {
							jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
						} catch (err) {
							console.log(err);
							jsonRes.Value = res.value.value.toString('utf8');
						}
					} else {
						jsonRes.Key = res.value.key;
						try {
							jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
						} catch (err) {
							console.log(err);
							jsonRes.Record = res.value.value.toString('utf8');
						}
					}
					allResults.push(jsonRes);
				}
				if (res.done) {
					console.log('end of data');
					await iterator.close();
					console.info(allResults);
					return allResults;
				}
			}
			/* 		// getting current state
					if (res.done) {
						console.info(`found state update with value: ${res.done.tx_id.toString('utf8')}`);
						const obj = JSON.parse(res.done.value.toString('utf8'));
						result.push(obj);
					} */
			/* 	await iterator.close();
				return result; */

		} catch (e) {
			console.log(e)
			return ''
		}
	}

	/**
	 * view  drug currentstate request on the network
	 * @param ctx - The transaction Context object
	 * @param serialNo - serialNo of the drug
	 * @param drugName - DrugName which is been shipped 
	 */

	async viewDrugCurrentState(ctx, drugName, serialNo) {
		try {
			if (!await utils.checkDefaultValidations(drugName)) {
				return new Error("Check Values")
			}

			if (!await utils.checkDefaultValidations(serialNo)) {
				return new Error("Check Values")
			}
			const productID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.adddrug', [drugName, serialNo]);
			console.log('productID ' + productID);
			/* 			var assetBuffer = await ctx.stub.getState(productID).catch(err => console.log(err));
						console.log('assetBuffer '+assetBuffer);
						var assetObject = JSON.parse(assetBuffer.toString());
						console.log('assetObject '+assetObject);


						const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.property', [propertyID]);
						let propertyObject= await utils.getData(ctx, propertyKey); */

			return await utils.getData(ctx, productID);
		} catch (e) {
			console.log(e)
			return ''
		}

	}



}

module.exports = pharmaContract;