const express = require('express');

const route = express.Router();

const { verifyAdmin } = require('../utils/verifyAccount');
const { login } = require('../controllers/auth');

// LOGIN: POST
route.post('/login', login);

// ADMIN LOGIN: POST
route.post('/admin/login', verifyAdmin, login);

module.exports = route;
