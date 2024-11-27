const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: String, required: true },
  hotel: { type: String, required: true, ref: 'Hotel' },
  name: { type: String },
  room: [{ type: Number, required: true }],
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  price: { type: Number, required: true },
  payment: {
    type: String,
    enum: ['Credit Card', 'Cash'],
    default: 'Cash',
  },
  status: {
    type: String,
    enum: ['Booked', 'Checkin', 'Checkout'],
    default: 'Booked',
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
