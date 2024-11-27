const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const hotelsRoute = require('./routes/hotels');
const roomsRoute = require('./routes/rooms');
const transactionsRoute = require('./routes/transactions');
const businessInformation = require('./routes/businessInformation');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/business-information', businessInformation);

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || 'Something went wrong!';
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

mongoose
  .connect(
    'mongodb+srv://lamtruong:SkOAXtwWaaEXEmg9@cluster0.nyndcmn.mongodb.net/booking?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Connect to database!');
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
