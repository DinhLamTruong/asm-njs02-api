const express = require('express');

const route = express.Router();

const {
  postTransactions,
  getTransactions,
  getTransactionsOfUser,
  getRecentTransaction,
} = require('../controllers/transactions');

route.post('/', postTransactions);

route.get('/', getTransactions);

route.get('/recent', getRecentTransaction);

route.get('/:username', getTransactionsOfUser);

module.exports = route;
