const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { couponApplied } = req.body;

    const user = await User.findOne({ email: req.user.email }).exec();
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: user._id,
    }).exec();

    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    } else {
      finalAmount = cartTotal * 100;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    });
  } catch (error) {
    console.log(error);
  }
};
