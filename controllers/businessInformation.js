const User = require('../models/user');
const Transaction = require('../models/transaction');

exports.getAllDatas = async (req, res, next) => {
  try {
    // getCountUsers
    const totalUsers = await User.countDocuments();

    // getOrderCounting
    const totalOrders = await Transaction.countDocuments();

    // getCountEarnings;
    const earningsResult = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: '$price' }, // Tính tổng giá trị trường "price"
        },
      },
    ]);
    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].totalPrice : 0;

    // getBalance
    // Sử dụng Aggregation Pipeline
    const result = await Transaction.aggregate([
      {
        // Chuyển đổi ngày (dateStart) sang tháng và năm
        // $project: Tạo các trường mới month và year từ dateStart, filed: month, year -> truy vấn
        $project: {
          month: { $month: '$dateStart' }, // Lấy tháng từ dateStart
          year: { $year: '$dateStart' }, // Lấy năm từ dateStart
          price: 1, // Giữ lại giá trị của trường "price"
        },
      },
      {
        // Nhóm dữ liệu theo tháng và năm, tính tổng doanh thu mỗi tháng
        $group: {
          _id: { month: '$month', year: '$year' }, // ĐK => Nhóm theo tháng và năm
          monthlyRevenue: { $sum: '$price' }, // Tính tổng doanh thu mỗi tháng
        },
      },
      {
        // Tính doanh thu trung bình từ các tháng
        $group: {
          _id: null,
          averageMonthlyRevenue: { $avg: '$monthlyRevenue' },
        },
      },
    ]);

    const averageRevenue =
      result.length > 0 ? result[0].averageMonthlyRevenue : 0;

    // Trả kết quả
    res.status(200).json({
      users: totalUsers,
      orders: totalOrders,
      earnings: totalEarnings,
      balance: averageRevenue.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      message: 'Error fetching data',
      error: error.message,
    });
  }
};
