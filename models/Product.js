const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      text: true,
    },
    slug: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: { type: mongoose.Schema.ObjectId, ref: "Category" },
    subcategory: [{ type: mongoose.Schema.ObjectId, ref: "SubCategory" }],
    quantity: { type: Number },
    sold: { type: Number, default: 0 },
    images: { type: Array },
    shipping: { type: String, enum: ["Yes", "No"] },
    color: {
      type: String,
      enum: ["Blue", "Sliver", "Black", "White", "Green"],
    },
    brand: {
      type: String,
      enum: ["Apple", "Microsoft", "Samsung", "Lenovo", "Asus"],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
