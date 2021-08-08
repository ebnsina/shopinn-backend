const express = require("express");
const router = express.Router();

const {
  create,
  read,
  update,
  remove,
  list,
} = require("../controllers/subcategoryController");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/subcategory", authCheck, adminCheck, create);
router.get("/subcategory", list);
router.get("/subcategory/:slug", read);
router.put("/subcategory/:slug", authCheck, adminCheck, update);
router.delete("/subcategory/:slug", authCheck, adminCheck, remove);

module.exports = router;
