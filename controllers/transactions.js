const Transaction = require('../models/transaction');

exports.postTransactions = (req, res, next) => {
  const newTranasction = new Transaction(req.body.transactionData);
  newTranasction
    .save()
    .then(result => {
      res.status(200).json('Transactions has been create!');
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getTransactions = (req, res, next) => {
  Transaction.find()
    .populate('hotel')
    .then(trs => {
      return res.status(200).json(trs);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getTransactionsOfUser = (req, res, next) => {
  const { username } = req.params;

  Transaction.find({ user: username })
    .populate('hotel')
    .then(trs => {
      return res.status(200).json(trs);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getRecentTransaction = (req, res, next) => {
  Transaction.find()
    .populate('hotel')
    .then(trs => {
      const recentTras = trs.slice(-8);
      return res.status(200).json(recentTras);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
