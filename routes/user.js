const express = require("express");
const router = express.Router();

const {
  getUserCart,
  userCart,
  emptyCart,
  saveAddress,
  applyCoupon,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeWishlist,
  createCod,
} = require("../controllers/userController");
const { authCheck } = require("../middlewares/auth");

router.get("/user/cart", authCheck, getUserCart);
router.post("/user/cart", authCheck, userCart);
router.delete("/user/cart", authCheck, emptyCart);

router.post("/user/address", authCheck, saveAddress);

router.post("/user/coupon", authCheck, applyCoupon);

router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, orders);

router.post("/user/cod", authCheck, createCod); // cash on delivery

router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeWishlist);

module.exports = router;
