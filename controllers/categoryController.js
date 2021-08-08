const slugify = require("slugify");
const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

exports.create = async (req, res) => {
  try {
    const category = await new Category({
      name: req.body.name,
      slug: slugify(req.body.name),
    });

    category.save();

    res.json(category);
  } catch (error) {
    res.status(400).send("Category create failed.");
  }
};

exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.json(categories);
  } catch (error) {
    res.status(404).send("Category not found.");
  }
};

exports.read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ category })
      .populate("category")
      .exec();

    res.json({
      category,
      products,
    });
  } catch (error) {
    res.status(404).send("Category not found.");
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name: req.body.name, slug: slugify(req.body.name) },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(400).send("Category not updated.");
  }
};

exports.remove = async (req, res) => {
  try {
    const subcategories = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
  } catch (error) {
    res.status(400).send("Category not deleted.");
  }
};

exports.getSubcategories = async (req, res) => {
  SubCategory.find({ parent: req.params._id }).exec((err, subcategories) => {
    if (err) console.log(err);
    res.json(subcategories);
  });
};
