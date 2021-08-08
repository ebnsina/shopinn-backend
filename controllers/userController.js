const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    const cart = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id name price totalAfterDiscount")
      .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;

    res.json({ products, cartTotal, totalAfterDiscount });
  } catch (error) {
    console.log(error);
  }
};

exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email }).exec();
    const cartExistByUser = await Cart.findOne({ orderedBy: user._id }).exec();

    if (cartExistByUser) {
      cartExistByUser.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      let obj = {};

      obj.product = cart[i]._id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;

      let productFromDatabase = await Product.findById(cart[i]._id)
        .select("price")
        .exec();

      obj.price = productFromDatabase.price;

      products.push(obj);

      let cartTotal = 0;

      for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
      }

      const newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
      }).save();

      res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();

  res.json({ ok: true });
};

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;

    await User.findOneAndUpdate({ email: req.body.email }, { address }).exec();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

exports.applyCoupon = async (req, res) => {
  const { coupon } = req.body;

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();

  if (validCoupon === null) {
    return res.json({ err: "Invalid coupon" });
  }

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id name price")
    .exec();

  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();
  const { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();

  const bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = Product.bulkWrite(bulkOption, {});

  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    const userOrders = await Order.find({ orderedBy: user._id })
      .populate("products.product")
      .exec();

    res.json(userOrders);
  } catch (error) {
    console.log(error);
  }
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.removeWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCod = async (req, res) => {
  const { cod, couponApplied } = req.body;

  if (!cod) return res.status(400).send("Cash on dleivery failed.");

  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100;
  } else {
    finalAmount = userCart.cartTotal * 100;
  }

  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uuidv4(),
      amount: finalAmount,
      currency: "usd",
      status: "Cash on delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderedBy: user._id,
    orderStatus: "Cash on delivery",
  }).save();

  const bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = Product.bulkWrite(bulkOption, {});

  res.json({ ok: true });
};
