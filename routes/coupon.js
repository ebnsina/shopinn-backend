const express = require("express");
const router = express.Router();

const { create, remove, list } = require("../controllers/couponController");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
