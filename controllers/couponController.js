const Coupon = require("../models/Coupon");

exports.create = async (req, res) => {
  try {
    const { name, discount, expiry } = req.body.coupon;

    const coupon = await new Coupon({
      name,
      discount,
      expiry,
    }).save();

    res.json(coupon);
  } catch (error) {
    console.log(error);
  }
};

exports.remove = async (req, res) => {
  try {
    await Coupon.findByIdAndRemove(req.params.couponId).exec();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.list = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).exec();

    res.json(coupons);
  } catch (error) {
    console.log(error);
  }
};
