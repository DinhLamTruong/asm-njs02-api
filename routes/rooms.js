const express = require('express');

const route = express.Router();
const {
  createRoom,
  deleteRoom,
  getListRooms,
  getAllRoom,
  getRoom,
  updateRoom,
  updateRoomAvailalbility,
  getListRoomUpdateHotel,
} = require('../controllers/room');

route.get('/list-room', getListRooms);

route.get('/list-room-hotel/:id', getListRoomUpdateHotel);

route.get('/all-room', getAllRoom);

route.get('/find/:id', getRoom);

route.post('/new-room', createRoom);

route.put('/updateroom', updateRoom);

route.delete('/delete-room/:hotelId', deleteRoom);

route.put('/update-room/:id', updateRoomAvailalbility);

module.exports = route;
