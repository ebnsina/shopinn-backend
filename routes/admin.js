const express = require("express");
const router = express.Router();

const { orders, orderStatus } = require("../controllers/adminController");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.get("/admin/orders", authCheck, adminCheck, orders);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

module.exports = router;
