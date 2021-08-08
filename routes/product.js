const express = require("express");
const router = express.Router();

const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  total,
  productStar,
  listRelated,
  searchFilters,
} = require("../controllers/productController");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", total);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);
router.get("/product/:slug", read);
router.post("/products/", list);
router.put("/products/star/:productId", authCheck, productStar);
router.get("/products/related/:productId", listRelated);
router.post("/search/filters", searchFilters);

module.exports = router;
