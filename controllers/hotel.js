const Hotel = require('../models/hotel');
const Room = require('../models/room');

exports.createHotel = async (req, res, next) => {
  try {
    const { infoHotel } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (
      !infoHotel ||
      !Array.isArray(infoHotel.rooms) ||
      infoHotel.rooms.length === 0
    ) {
      return res.status(400).json({ message: 'Invalid input data.' });
    }

    // Tạo khách sạn mới
    const newHotel = new Hotel(req.body.infoHotel);
    await newHotel.save();

    // Cập nhật các phòng liên quan
    await Room.updateMany(
      { _id: { $in: infoHotel.rooms } }, // Điều kiện cập nhật: các phòng trong danh sách `rooms`
      { isUsed: true } // Cập nhật trạng thái `isUsed` thành `true`
    );

    // Trả về kết quả thành công
    return res.status(200).json({ message: 'Created hotel successfully!' });
  } catch (err) {
    // Xử lý lỗi
    console.error(err);
    return res.status(500).json({ message: 'An error occurred.', error: err });
  }
};

exports.getAllHotels = (req, res, next) => {
  Hotel.find()
    .then(hotel => {
      res.status(200).json(hotel);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.searchHotel = async (req, res, next) => {
  try {
    const { city, min, max } = req.query; // City, price range, room count
    const { startDate, endDate } = req.body.dates; // Date range
    const { opts } = req.body;

    // Search for hotels in the specified city and price range
    const hotels = await Hotel.find({
      city: new RegExp(city, 'i'),
      cheapestPrice: { $gte: min || 0, $lte: max || 9999 },
    }).populate('rooms'); // Populate room details

    const availableHotels = hotels.filter(hotel => {
      let availableRoomCount = 0;

      hotel.rooms.forEach(room => {
        room.roomNumbers.forEach(roomNumber => {
          // Check if the room is available for the entire date range
          const isAvailable = roomNumber.unavailableDates.every(
            date =>
              new Date(date) == new Date(startDate) ||
              new Date(date) == new Date(endDate)
          );

          if (isAvailable) {
            availableRoomCount++;
          }
        });
      });

      // Check if the hotel has enough available rooms
      return availableRoomCount >= opts.room;
    });
    res.status(200).json(availableHotels);
  } catch (err) {
    next(err);
  }
};

exports.getHotel = (req, res, next) => {
  const detailHotel = Hotel.findById(req.params.id);
  detailHotel
    .then(hotel => {
      return res.status(200).json(hotel);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateHotel = async (req, res, next) => {
  const idHotel = req.params.id;

  try {
    // Cập nhật trạng thái của các phòng liên quan
    if (req.body.infoHotel.rooms) {
      await Room.updateMany(
        { _id: { $in: req.body.infoHotel.rooms } }, // Điều kiện cập nhật: các phòng trong danh sách `rooms`
        { $set: { isUsed: true } } // Cập nhật trạng thái `isUsed` thành `true`
      );
    }

    // Cập nhật thông tin khách sạn
    const updatedHotel = await Hotel.findByIdAndUpdate(
      idHotel,
      { $set: req.body.infoHotel },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json({ message: 'Hotel has been updated!', updatedHotel });
  } catch (err) {
    next(err); // Gửi lỗi đến middleware xử lý lỗi
  }
};

exports.deleteHotel = (req, res, next) => {
  Hotel.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(200).json('Hotel has been delete!');
    })
    .catch(err => next(err));
};

exports.countByCity = (req, res, next) => {
  const cities = req.query.cities.split(',');
  Promise.all(
    cities.map(city => {
      return Hotel.countDocuments({ city: city }).then(count => count);
    })
  )
    .then(list => {
      res.status(200).json(list);
    })
    .catch(error => {
      next(error);
    });
};

exports.countByType = (req, res, next) => {
  Promise.all([
    Hotel.countDocuments({ type: 'hotel' }),
    Hotel.countDocuments({ type: 'apartment' }),
    Hotel.countDocuments({ type: 'resort' }),
    Hotel.countDocuments({ type: 'villa' }),
    Hotel.countDocuments({ type: 'cabin' }),
  ])
    .then(counts => {
      const result = counts.map((count, index) => ({
        type: ['hotel', 'apartment', 'resort', 'villa', 'cabin'][index],
        count,
      }));
      res.status(200).json(result);
    })
    .catch(error => next(error));
};

exports.highestRating = (req, res, next) => {
  Hotel.find()
    .then(hotels => hotels.sort((a, b) => b.rating - a.rating))
    .then(hotels => res.status(200).json(hotels.slice(0, 3)))
    .catch(err => next(err));
};

exports.getHotelRooms = (req, res, next) => {
  Hotel.findById(req.params.id)
    .then(hotel => {
      const roomPromises = hotel.rooms.map(room => Room.findById(room));
      return Promise.all(roomPromises);
    })
    .then(rooms => {
      res.status(200).json(rooms);
    })
    .catch(err => next(err));
};
