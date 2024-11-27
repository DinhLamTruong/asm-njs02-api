const Room = require('../models/room');
const Hotel = require('../models/hotel');

exports.createRoom = async (req, res, next) => {
  try {
    const { idHotel, infoRoom, roomNumbers } = req.body;

    // Xác định giá trị `isUsed`
    const isUsed = idHotel ? true : false;

    // Tạo một đối tượng Room mới
    const newRoom = new Room({
      ...infoRoom,
      maxPeople: +infoRoom.maxPeople,
      roomNumbers,
      isUsed,
    });

    // Lưu phòng vào cơ sở dữ liệu
    const saveRoom = await newRoom.save();

    // Nếu không có `idHotel`, trả về luôn
    if (!idHotel) {
      return res.status(200).json({ message: 'Create room success!' });
    }

    // Nếu có `idHotel`, cập nhật danh sách phòng trong `Hotel`
    await Hotel.findByIdAndUpdate(idHotel, {
      $push: { rooms: saveRoom._id },
    });

    res.status(200).json({
      message: 'Room created and linked to hotel successfully!',
    });
  } catch (err) {
    next(err);
  }
};

exports.getListRooms = async (req, res, next) => {
  try {
    // Tìm tất cả các phòng có isUsed là false
    const rooms = await Room.find({ isUsed: false });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: 'No available rooms found.' });
    }

    // Trả về danh sách phòng
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getRoom = (req, res, next) => {
  Room.findById(req.params.id)
    .then(room => res.status(200).json(room))
    .catch(err => next(err));
};

exports.getListRoomUpdateHotel = async (req, res, next) => {
  try {
    const idHotel = req.params.id;

    // Tìm khách sạn theo ID
    const hotel = await Hotel.findById(idHotel).populate('rooms'); // Lấy thông tin các phòng của hotel
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Lấy danh sách phòng của khách sạn
    const listRoomOfHotel = hotel.rooms;

    // Tìm tất cả phòng có `isUsed: false`
    const availableRooms = await Room.find({ isUsed: false });

    res.status(200).json({
      listRoomOfHotel,
      availableRooms,
    });
  } catch (err) {
    next(err); // Gửi lỗi đến middleware xử lý lỗi
  }
};

exports.updateRoom = (req, res, next) => {
  Room.findByIdAndUpdate(
    req.body.infoRoom._id,
    {
      $set: req.body.infoRoom,
    },
    { new: true }
  )
    .then(room => {
      room.save();
      res.status(200).json('Room has been update!');
    })
    .catch(err => next(err));
};

exports.getAllRoom = (req, res, next) => {
  Room.find()
    .then(room => {
      res.status(200).json(room);
    })
    .catch(err => next(err));
};

exports.updateRoomAvailalbility = (req, res, next) => {
  Room.updateOne(
    { 'roomNumbers._id': req.params.id },
    { 'roomNumbers.$.unavailableDates': req.body.dates }
  )
    .then(result => res.status(200).json('Room availalbility has been update!'))
    .catch(err => next(err));
};

exports.deleteRoom = (req, res, next) => {
  const hotelId = req.params.hotelId;
  Room.findByIdAndDelete(req.body.id)
    .then(result => {
      Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.body.id },
      }).catch(err => next(err));
    })
    .then(result => {
      res.status(200).json('Room has been deleted!');
    })
    .catch(err => next(err));
};
