const mongoose = require('mongoose')

mongoose.connect(
    'mongodb://localhost:27017/mongo',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(
    () => console.log('MongoDB Connected')
).catch(
    err => console.log(err)
);

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = {
    Payment
}