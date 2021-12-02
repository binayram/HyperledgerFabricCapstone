class utils {


    /**
     * common method to getHierarchyID from the organisationRole
     * @param ctx - The transaction Context object
     * @param organisationRole - organisatoinal role defined
     */
    getHierarchyID(ctx, organisationRole) {
        switch (organisationRole) {
            case 'Manufacturer':
                return 1;
            case 'Distributor':
                return 2;
            case 'Retailer':
                return 3
            case 'Transporter':
                return ""
            default:
                const initiatorID = ctx.clientIdentity.getX509Certificate();
                return new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' Only Manufacturer, Distributor, Retailer and Transporter are allowed to do this transaction');

        }
        /*  if (organisationRole == 'Manufacturer')
            return 1;
        else if (organisationRole == 'Distributor')
            return 2;
        else if (organisationRole == 'Retailer')
            return 3;
        else if(organisationRole == 'Transporter')
            return ""
        else
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' Only Manufacturer, Distributor, Retailer and Transporter are allowed to do this transaction');
  */
    }


    //Stores any JSONvalue on the ledger
    async putData(ctx, key, JSONvalue) {
        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(JSONvalue));
        console.log('dataBuffer' + dataBuffer);
        await ctx.stub.putState(key, dataBuffer);
    }
    /**
     * common method to check the initiator of the transaction
     * @param ctx - The transaction Context object
     */
    validateInitiator(ctx, initiator) {
        console.log("initiator");
        const initiatorID = ctx.clientIdentity.getX509Certificate();
        console.log(initiator);
        if (initiatorID.issuer.organizationName.trim() !== initiator) {
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');
        }
    }

    /**
     * common method to check/ allow only manufacturer,retailer,transporter and distributor
     * @param ctx - The transaction Context object
     */
    validateInitiatorCompanyRegistration(ctx) {
        console.log("initiator");
        const initiatorID = ctx.clientIdentity.getX509Certificate();
        console.log(initiatorID);
        if (initiatorID.issuer.organizationName.trim() === 'manufacturer.pharma-network.com' ||
            initiatorID.issuer.organizationName.trim() === 'retailer.pharma-network.com' ||
            initiatorID.issuer.organizationName.trim() === 'distributor.pharma-network.com' ||
            initiatorID.issuer.organizationName.trim() === 'transporter.pharma-network.com') {
            return true;
        } else {
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');
        }
    }
    /**
     * common method to check/ allow only retailer and distributor
     * @param ctx - The transaction Context object
     */
    validateInitiatorCreatePO(ctx) {
        console.log("initiator");
        const initiatorID = ctx.clientIdentity.getX509Certificate();
        console.log(initiatorID);
        if (initiatorID.issuer.organizationName.trim() === 'retailer.pharma-network.com' ||
            initiatorID.issuer.organizationName.trim() == 'distributor.pharma-network.com') {
            return true;
        } else {
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');

        }
    }


    /**
     * common method to check/ allow only manufacturer and distributor
     * @param ctx - The transaction Context object
     */
    validateInitiatorCreateShipment(ctx) {
        console.log("initiator");
        const initiatorID = ctx.clientIdentity.getX509Certificate();
        console.log(initiatorID);
        if (initiatorID.issuer.organizationName.trim() == 'manufacturer.pharma-network.com' ||
            initiatorID.issuer.organizationName.trim() == 'distributor.pharma-network.com') {
            return true;
        } else {
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');

        }
    }

    /**
     * common method to get the data
     * @param ctx - The transaction Context object
     * @param key - assetkey
     */
    async getData(ctx, key) {
        let dataBuffer = await ctx.stub.getState(key).catch(err => console.log(err));
        console.log('dataBuffer' + dataBuffer)
        if (dataBuffer != undefined) {
            let dataObject = JSON.parse(dataBuffer.toString())
            console.log('dataObject' + dataObject)
            return dataObject;
        } else {
            return new Error("Key is missing in the network, hence exitting")
        }
    }
    /**
     * common method to get the manufacturer name from the register block
     * @param ctx - The transaction Context object
     * @param companyCRN - CRN of the company
     */
    async getManufacturerName(ctx, companyCRN) {
        // const manufacturerKey = ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [companyCRN]);
        // let manufacturerBuffer = await ctx.stub.getState(manufacturerKey).catch(err => console.log(err));
        // let ManufacturerObject = JSON.parse(manufacturerBuffer.toString());
        // return ManufacturerObject.name;
        console.log(companyCRN);
        //get the composite key value
        const manufacturerKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.register', [companyCRN]);
        try {
            console.log(manufacturerKey);
            let dataBuffer = await ctx.stub.getState(manufacturerKey).catch(err => console.log(err));
            console.log(dataBuffer);
            if(dataBuffer!=undefined){
                let ManufacturerObject = JSON.parse(dataBuffer.toString())
                // let ManufacturerObject = await getData(ctx,manufacturerKey);
                console.log(ManufacturerObject);
    
                return ManufacturerObject.companyName;
            }else {
                return new Error("Key is missing in the network, hence exitting")
            }
          
        } catch (e) {
            return ManufacturerObject.companyName = '';
        }

    }
    /**
     * common method to check hierarchy, this method makes sure that assets pass one level at a time
     * @param ctx - The transaction Context object
     * @param buyerCRN - CRN of the buyer
     * @param drugName - Name of the drug for which quantity needs to be extracted
     */
    async checkHirerchy(ctx, buyerCompositeKey, sellerCompositeKey) {
        console.log("Buyer Comp " + buyerCompositeKey);
        console.log("Seller Comp " + sellerCompositeKey);
        let buyerObject = await this.getData(ctx,buyerCompositeKey);
       /*  let buyerBuffer = await ctx.stub.getState(buyerCompositeKey).catch(err => console.log(err));
        let buyerObject = await JSON.parse(buyerBuffer.toString()); */
        console.log("buyerObject " + buyerObject);

 /*        let sellerBuffer = await ctx.stub.getState(sellerCompositeKey).catch(err => console.log(err));
        let sellerObject = await JSON.parse(sellerBuffer.toString()); */
        let sellerObject = await this.getData(ctx,sellerCompositeKey);
        console.log("sellerObject " + sellerObject);
        // Checks buyer is of higher number than seller
        if (parseInt(buyerObject.hierarchy) > parseInt(sellerObject.hierarchy)) {
            // Checks buyer is just one number higher than seller
            if (parseInt(buyerObject.hierarchy) - 1 == parseInt(sellerObject.hierarchy)) {
                return true;
            } else {
                const initiatorID = ctx.clientIdentity.getX509Certificate();
                throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');

            }
        } else {
            console.log("sellerObject.hierarchy  " + sellerObject.hierarchy);
            console.log("buyerObject.hierarchy  " + buyerObject.hierarchy);
            const initiatorID = ctx.clientIdentity.getX509Certificate();
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');

        }
    }
    /**
     * common method to get the list of assets quantity
     * @param ctx - The transaction Context object
     * @param buyerCRN - CRN of the buyer
     * @param drugName - Name of the drug for which quantity needs to be extracted
     */
    async getQuantity(ctx, buyerCRN, drugName) {
        console.log('buyerCRN ' + buyerCRN + 'drugName ' + drugName)
        const poID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.purchaseOrder', [buyerCRN, drugName]);
        console.log('poID ' + poID)
        /* let poBuffer = await ctx.stub.getState(poID).catch(err => console.log(err));
        console.log('poBuffer '+poBuffer)
        let poObject = JSON.parse(poBuffer.toString());
        console.log('poObject '+poObject) */
        let poObject = await this.getData(ctx, poID)
        console.log('poObjectq ' + poObject.quantity)
        return poObject.quantity;
    }

    //updating owner for every Asset
    /**
     * common method to update owners of Asset
     * @param ctx - The transaction Context object
     * @param asset - serialNo for which owner has to be updated 
     * @param owner - Owner CRN 
     * @param shipmentID - Shipment ID
     */
    async updateOwner(ctx, asset, owner, shipmentID, drugName) {
        const assetKey = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.adddrug', [drugName, asset]);
        let assetBuffer = await ctx.stub.getState(assetKey).catch(err => console.log(err));
        console.log("assetBuffer " + assetBuffer)
        if (assetBuffer != undefined) {
            //updating specific fields
            let assetObject = JSON.parse(assetBuffer.toString());
            console.log('Owner-----------------' + owner + '-------------------')
            // assetObject.owner = owner
            //  const initiatorID = await ctx.clientIdentity.getX509Certificate();
            var shipmentData = assetObject.shipment
            //   if ("transporter.pharma-network.com" != initiatorID.issuer.organizationName.trim()) {
            if (shipmentData == null) {
                shipmentData = shipmentID
            } else {
                shipmentData = shipmentData + "|" + shipmentID;
            }
            /*  } else {
                 //console.log("Shipment id will not be updated if its transporter")
             } */


            let newDrugObject = {
                productID: assetObject.productID, //Product ID will store the composite key using which the product will be stored on the ledger
                name: assetObject.drugName, //Name of the product
                manufacturer: assetObject.manufacturerCompositeKey, //Composite key of the manufacturer used to store manufacturer’s detail on the ledger
                mfgDate: assetObject.mfgDate, // Date of manufacturing of the drug
                expDate: assetObject.expDate, // Expiration date of the drug
                owner: owner, // Key of the drug owner(I have assumed it to be CRN value)
                shipment: shipmentData // Used to store the list of keys of all the shipment objects that will be associated with this asset. When the drug is added to the ledger, this field will store no value. 
            }


            await this.putData(ctx, assetKey, newDrugObject);
        } else {
            return new Error("AssetKey is missing in the network, hence exitting")
        }

    }

    //updating owners for every Asset
    /**
     * common method to update owners of Asset
     * @param ctx - The transaction Context object
     * @param listOfAssets - list of assets in string
     * @param OwnerCRN - currentCRN is the CRN whom its been transfered
     * @param shipmentID - Shipment ID
     * @param drugName - Name of the drug
     */
    async updateOwners(ctx, listOfAssets, OwnerCRN, shipmentID, drugName) {
        // looping an get asset key to update owners
        for (var i = 0; i < listOfAssets.length; i++) {
            console.log("listOfAssets[" + i + "] " + listOfAssets[i]);
            try {
                //var assetKey = listOfAssets[i];
                console.log("Before listOfAssets[i] " + listOfAssets[i]);
                console.log("Before owner " + OwnerCRN);
                console.log("Before shipmentID " + shipmentID);

                await this.updateOwner(ctx, listOfAssets[i], OwnerCRN, shipmentID, drugName)
            } catch (e) {
                console.log(e);
                return new Error("AssetKey is missing in the network, hence exitting")
            }

        }

    }

    /**
     * common method to check AssetList of the shipment
     * @param ctx - The transaction Context object
     * @param shipmentKey - Shipment key(Composite key)
     */

    async getAssetList(ctx, shipmentKey) {
        console.log('shipmentKey' + shipmentKey);
        let dataBuffer = await ctx.stub.getState(shipmentKey).catch(err => console.log(err));
        console.log('dataBuffer' + dataBuffer);
        if (dataBuffer != undefined) {
            let shipmentObject = JSON.parse(dataBuffer.toString())
            console.log('shipmentObject' + shipmentObject);
            return shipmentObject.assets;
        } else {
            return new Error("AssetKey is missing in the network, hence exitting")
        }


    }

    /**
     * common method to check validations
     * @param value - value to be checked
     * @param StringValue - String to be printed
     */

    checkDefaultValidations(value) {
        console.log('StringValue1 ' + value);
        if (value == null || value == "") {
            console.log('StringValue2 ' + value);
            return false;
        } else {
            return true;
        }
    }

    /**
     * common method to check validations
     * @param drugName - Name of the drug
     * @param owner - owner to be checked for the asset
     * @param listOfAssets - List of assets to be checked
     */


    async checkAllAssetsBelongToOwner(ctx, drugName, owner, listOfAssets) {
        for (var i = 0; i < listOfAssets.length; i++) {
            const productID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.adddrug', [drugName, listOfAssets[i]]);
            let assetBuffer = await ctx.stub.getState(productID).catch(err => console.log(err));
            let assetObject = JSON.parse(assetBuffer.toString());
            if (assetBuffer != undefined && assetObject.owner != owner) {
                console.log('assetObject.owner ' + assetObject.owner + ' ' + owner + false);
                return false
            } else {
                console.log('assetObject.owner ' + assetObject.owner + ' ' + owner + true);
                return true
            }
        }
    }

    /**
     * common method to get the SellerCRN
     * @param ctx - The transaction Context object
     * @param buyerCRN - CRN of the buyer
     * @param drugName - Name of the drug for which quantity needs to be extracted
     */
    async getOwner(ctx, buyerCRN, drugName) {
        console.log('buyerCRN ' + buyerCRN + 'drugName ' + drugName)
        const poID = await ctx.stub.createCompositeKey('org.pharma-network.com.pharmasupplychain.purchaseOrder', [buyerCRN, drugName]);
        console.log('poID ' + poID)
        let poObject = await this.getData(ctx, poID)
        console.log('poObjectq ' + poObject.sellerCRN)
        return poObject.sellerCRN;

    }

}
module.exports = utils;