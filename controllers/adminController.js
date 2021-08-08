const User = require("../models/User");
const Order = require("../models/Order");

exports.orders = async (req, res) => {
  const orders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();

  res.json(orders);
};

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );

  res.json(updated);
};
