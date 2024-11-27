const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    password: hash,
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isAdmin: req.body.isAdmin,
  });
  newUser
    .save()
    .then(result => {
      res.status(200).send('User has been created!');
    })
    .catch(err => {
      next(err);
    });
};
