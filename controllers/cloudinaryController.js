const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_large(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });

    console.log(result);

    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.removeImage = async (req, res) => {
  try {
    const image_id = req.body.public_id;

    cloudinary.uploader.destroy(image_id, (err, result) => {
      if (err) return res.json({ success: false, err });
      res.end("Okay.");
    });
  } catch (error) {
    console.log(error);
  }
};
