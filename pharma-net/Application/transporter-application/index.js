const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const registerCompany = require('./1_registerCompany');
const updateShipment = require('./2_updateShipment');
const viewHistory = require('./3_viewHistory');
const viewDrugCurrentState = require('./4_viewDrugCurrentState');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma SupplyChain App');

app.get('/', (req, res) => res.send('Hello Transporter'));

app.post('/addToWallet', async(req, res) => {
    try {
        var data = await addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath)
       
            console.log('Transport Admin credentials added to wallet');
            const result = {
                status: 'success',
                message: 'Transport Admin credentials added to wallet',
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
            console.log('Transporter added to Network');
            const result = {
                status: 'success',
                message: 'Transporter added to Network',
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
app.post('/updateShipment', async(req, res) => {
    try {
        var data = await updateShipment.execute(req.body.buyerCRN, req.body.drugName, req.body.transporterCRN)
        if (data != null && data != '') {
            console.log('Shippment update request submitted on the Network');
            const result = {
                status: 'success',
                message: 'Shippment update request submitted on the Network',
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

app.post('/viewDrugCurrentState', async(req, res) => {
    try {
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


app.listen(port, () => console.log(`Distributed Pharma Transporter App listening on port ${port}!`));