const express = require("express");
const {
  uploadImage,
  removeImage,
} = require("../controllers/cloudinaryController");
const router = express.Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/uploadImage", authCheck, adminCheck, uploadImage);
router.post("/removeImage", authCheck, adminCheck, removeImage);

module.exports = router;
