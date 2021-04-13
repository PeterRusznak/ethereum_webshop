var express = require('express')
var cors = require('cors')
var app = express()
const ethers = require('ethers');
const PaymentProcessor = require('../artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json');
const { Payment } = require('./db.js')

let paymentId = 520;

app.use(cors())
app.listen(4000, function () {
    console.log('CORS-enabled web server listening on port 4000')
})

app.get('/api/getPaymentId/:id', async function (req, res) {
    paymentId++;
    await Payment.create(
        {
            id: paymentId,
            itemId: req.params.id,
            paid: false
        }
    );
    res.json({ paymentId })
});

const items = {
    '1': { id: 1, url: "http://urlToDownloadPurchasedBook_1.pdf" },
    '2': { id: 2, url: "http://urlToDownloadPurchasedBook_2.pdf" },
}
app.get('/api/getUrl/:paymentId', async function (req, res) {
    const payment = await Payment.findOne({ id: req.params.paymentId })
    if (payment && payment.paid === true) {
        res.json({ url: items[payment.itemId].url });
    } else {
        res.json({ url: "" });
    }
});

const pp_address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const listenEvents = () => {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

    const paymentProcessor = new ethers.Contract(
        pp_address,
        PaymentProcessor.abi,
        provider
    );
    paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
        const payment = await Payment.findOne({ id: paymentId })
        if (payment) {
            payment.paid = true;
            await payment.save();
        }
    });
}
listenEvents()

