const express = require('express');

const route = express.Router();

const { getAllDatas } = require('../controllers/businessInformation');

route.get('/', getAllDatas);

module.exports = route;
