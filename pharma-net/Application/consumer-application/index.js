const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const viewHistory = require('./1_viewHistory');
const viewDrugCurrentState = require('./2_viewDrugCurrentState');
const addDrug = require('./2_addDrug');


// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma SupplyChain App');

app.get('/', (req, res) => res.send('Hello Consumer'));

app.post('/addToWallet', async (req, res) => {
    try {
        var data = await addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath)
       
            console.log('Consumer Admin credentials added to wallet');
            const result = {
                status: 'success',
                message: 'Consumer Admin credentials added to wallet',
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

app.post('/viewHistory', async (req, res) => {
    try {
        var data = await viewHistory.execute(req.body.drugName, req.body.serialNo)
        if (data != null && data != '') {
            console.log('View History request submitted on the Network');
            const result = {
                status: 'success',
                message: 'View History request submitted on the Network',
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
        };
        res.status(500).send(result);
    }
});

app.post('/viewDrugCurrentState', async (req, res) => {
    try {
        var data = await viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo) /* then ((data) => { */
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
        };
        res.status(500).send(result);
    }
    /*    }) */
    /*  .catch((e) => {
         const result = {
             status: 'error',
             message: 'Failed',
             error: e
         };
         res.status(500).send(result);
     }); */
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

app.listen(port, () => console.log(`Distributed Pharma Consumer App listening on port ${port}!`));