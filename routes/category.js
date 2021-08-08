const express = require("express");
const router = express.Router();

const {
  create,
  read,
  update,
  remove,
  list,
  getSubcategories,
} = require("../controllers/categoryController");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/category", authCheck, adminCheck, create);
router.get("/category", list);
router.get("/category/subcategory/:_id", getSubcategories);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);

module.exports = router;
