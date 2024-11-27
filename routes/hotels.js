const express = require('express');

const route = express.Router();
const {
  createHotel,
  getHotel,
  deleteHotel,
  countByCity,
  countByType,
  highestRating,
  searchHotel,
  getAllHotels,
  getHotelRooms,
  updateHotel,
} = require('../controllers/hotel');

// CREATE HOTEL: POST
route.post('/', createHotel);

// GET ALL  HOTELS: GET
route.get('/all', getAllHotels);

// SEARCH HOTELS: POST
route.post('/search', searchHotel);

// GET HOTEL: GET
route.get('/find/:id', getHotel);

// UPDATE HOTEL: PUT
route.put('/update/:id', updateHotel);

// DELETE HOTEL: DELETE
route.delete('/:id', deleteHotel);

// GET HOTEL BY CITY
route.get('/countByCity', countByCity);

// GET HOTEL BY TYPE
route.get('/countByType', countByType);

// GET HOTEL BY RATING
route.get('/highestRating', highestRating);

// GET HOTEL ROOMS
route.get('/hotel-rooms/:id', getHotelRooms);

module.exports = route;
