const User = require("../models/User");

exports.createOrUpdateUser = async (req, res) => {
  const { name, email, picture } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    {
      name: email.split("@")[0],
      picture,
    },
    { new: true }
  );

  if (user) {
    res.json(user);
  } else {
    let user = await new User({
      name: email.split("@")[0],
      email,
      picture,
    });

    user = user.save();
    res.json(user);
  }
};

exports.currentUser = async (req, res) => {
  try {
    await User.findOne({ email: req.user.email }).exec((err, user) => {
      if (err) throw new Error(err);
      res.json(user);
    });
  } catch (error) {
    console.log(error);
  }
};
