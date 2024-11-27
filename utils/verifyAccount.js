const User = require('../models/user');
const { createErr } = require('./error');

exports.verifyAdmin = (req, res, next) => {
  console.log(req.body);
  const user = User.findOne({ username: req.body.username });
  user.then(user => {
    if (!user || user.isAdmin) {
      next();
    } else {
      return next(createErr(403, 'You are not authorized!'));
    }
  });
};

exports.verifyUser = (req, res, next) => {
  const user = User.findOne({ username: req.body.username });
  user.then(user => {
    if (!user) {
      next();
    } else {
      return next(createErr(409, 'Username early exist!'));
    }
  });
};
