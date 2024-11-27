const express = require('express');

const route = express.Router();

const { verifyUser } = require('../utils/verifyAccount');
const { register } = require('../controllers/user');

// REGISTER USER: POST
route.post('/register', verifyUser, register);

module.exports = route;
