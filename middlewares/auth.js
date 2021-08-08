const admin = require("../firebase");
const User = require("../models/User");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log(firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Invalid or expred token" });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await User.findOne({ email }).exec();

    if (adminUser.role !== "admin") {
      res.status(403).json({
        err: "Admin rosource. Access denied.",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Invalid or expired token." });
  }
};
