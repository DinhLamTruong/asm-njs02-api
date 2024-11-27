const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { createErr } = require('../utils/error');

exports.login = (req, res, next) => {
  const user = User.findOne({ username: req.body.username });
  user
    .then(user => {
      if (!user) return next(createErr(404, 'User not found!'));
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!isPasswordCorrect)
        return next(createErr(400, 'Wrong username or password!'));

      const { password, isAdmin, createdAt, updatedAt, ...otherDetails } =
        user._doc;

      res.status(200).json({ details: { ...otherDetails }, isAdmin });
    })
    .catch(err => next(err));
};
