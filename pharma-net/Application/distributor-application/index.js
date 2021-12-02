const express = require('express');
const app = express();
const cors = require('cors');
const port = 2000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const registerCompany = require('./1_registerCompany');
const createPO = require('./2_createPO');
const createShipment = require('./3_createShipment');
const viewHistory = require('./4_viewHistory');
const viewDrugCurrentState = require('./5_viewDrugCurrentState');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma SupplyChain App');

app.get('/', (req, res) => res.send('Hello Distributor'));

app.post('/addToWallet', async(req, res) => {
    try{
        var data = await  addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath)
        
            console.log('Distributor Admin credentials added to wallet');
            const result = {
                status: 'success',
                message: 'Distributor Admin credentials added to wallet',
                data: data
            };
            res.json(result);
       
        }catch(e) {
            const result = {
                status: 'error',
                message: 'Failed',
                error: e
            };
            res.status(500).send(result);
        };
});

app.post('/registerCompany', async (req, res) => {
    try {
        var data = await registerCompany.execute(req.body.companyCRN, req.body.companyName, req.body.location, req.body.organisationRole);
        if (data != null && data != '') {
            console.log('Distributor added to Network');
            const result = {
                status: 'success',
                message: 'Distributor added to Network',
                data: data
            };
            res.json(result);
        } else {
            const result = {
                status: 'error',
                message: 'Please Check values',
            };
            //res.json(result);
            res.status(200).send(result);
        }
    } catch (e) {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    }
});

app.post('/createPO', async (req, res) => {
    try {
        var data = await createPO.execute(req.body.buyerCRN, req.body.sellerCRN, req.body.drugName, req.body.quantity)
        if (data != null && data != '') {
            console.log('Add New PO request submitted on the Network');
            const result = {
                status: 'success',
                message: 'Add new PO request submitted on the Network',
                data: data
            };
            res.json(result);
        } else {
            const result = {
                status: 'error',
                message: 'Please Check values',
            };
            //res.json(result);
            res.status(200).send(result);
        }
    } catch (e) {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    };
});

app.post('/createShipment', async(req, res) => {
    try{
        var data = await createShipment.execute(req.body.buyerCRN, req.body.drugName, req.body.listOfAssets, req.body.transporterCRN)
        if (data != null && data != '') {
            console.log('Shipment request submitted on the Network');
            const result = {
                status: 'success',
                message: 'Shipment request submitted on the Network',
                data: data
            };
            res.json(result);
        } else {
            const result = {
                status: 'error',
                message: 'Please Chck values',
                error: e
            }
            res.json(result);
        }
        }catch(e){
            const result = {
                status: 'error',
                message: 'Failed',
                error: e
            };
            res.status(500).send(result);
        };
});

app.post('/viewHistory', async(req, res) => {
    try{
        var data = await viewHistory.execute(req.body.drugName, req.body.serialNo)
        if (data != null && data != '') {
            console.log('View History request submitted on the Network');
            const result = {
                status: 'success',
                message: 'View History  request submitted on the Network',
                data: data
            };
            res.json(result);
        } else {
            const result = {
                status: 'error',
                message: 'Please Chck values',
                error: e
            }
            res.json(result);
        }
        }catch(e){
            const result = {
                status: 'error',
                message: 'Failed',
                error: e
            };
            res.status(500).send(result);
        };
});

app.post('/viewDrugCurrentState', async(req, res) => {
    try{
        var data = await viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo)
        if (data != null && data != '') {
            console.log('View Drug CurrentState request submitted on the Network');
            const result = {
                status: 'success',
                message: 'View Drug CurrentState request submitted on the Network',
                data: data
            };
            res.json(result);
        } else {
            const result = {
                status: 'error',
                message: 'Please Chck values',
            }
            res.json(result);
        }
        }catch(e)  {
            const result = {
                status: 'error',
                message: 'Failed',
                error: e
            };
            res.status(500).send(result);
        };
});


app.listen(port, () => console.log(`Distributed Pharma Distributor App listening on port ${port}!`));