const express = require('express');
const app = express();
const cors = require('cors');
const port = 1000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const registerCompany = require('./1_registerCompany');
const addDrug = require('./2_addDrug');
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

app.get('/', (req, res) => res.send('Hello Manufacturer'));

app.post('/addToWallet', async(req, res) => {
    try {
        var data = await addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath)
      
            console.log('Manufacturer Admin credentials added to wallet');
            const result = {
                status: 'success',
                message: 'Manufacturer Admin credentials added to wallet',
                data: data
            };
            res.json(result);
        
    } catch (e) {
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
            console.log('Manufacturer added to Network');
            const result = {
                status: 'success',
                message: 'Manufacturer added to Network',
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

app.post('/addDrug', async (req, res) => {
    try {
        var data = await addDrug.execute(req.body.drugName, req.body.serialNo, req.body.mfgDate, req.body.expDate, req.body.companyCRN);
        if (data != null && data != '') {
            console.log('Add New Drug request submitted on the Network');
            const result = {
                status: 'success',
                message: 'Add new Drug request submitted on the Network',
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
    try {
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

app.post('/viewHistory', async(req, res) => {
    try {
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

app.post('/viewDrugCurrentState', async (req, res) => {
    var data = await viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo)
    try {
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
                error: e
            }
            res.json(result);
        }
    } catch (e) {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        }
        res.status(500).send(result);
    }

});


app.listen(port, () => console.log(`Distributed Pharma Manufacturer App listening on port ${port}!`));