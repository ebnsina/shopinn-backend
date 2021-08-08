const slugify = require("slugify");
const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");

exports.create = async (req, res) => {
  try {
    const subcategory = await new SubCategory({
      name: req.body.name,
      parent: req.body.parent,
      slug: slugify(req.body.name),
    });

    subcategory.save();

    res.json(subcategory);
  } catch (error) {
    res.status(400).send("Sub Category create failed.");
  }
};

exports.list = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({})
      .sort({ createdAt: -1 })
      .exec();
    res.json(subcategories);
  } catch (error) {
    res.status(404).send("Sub Category not found.");
  }
};

exports.read = async (req, res) => {
  try {
    const subcategory = await SubCategory.findOne({
      slug: req.params.slug,
    }).exec();

    const products = await Product.find({ subcategory })
      .populate("category")
      .exec();

    res.json({
      subcategory,
      products,
    });
  } catch (error) {
    res.status(404).send("Sub Category not found.");
  }
};

exports.update = async (req, res) => {
  try {
    const subcategory = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name: req.body.name,
        parent: req.body.parent,
        slug: slugify(req.body.name),
      },
      { new: true }
    );
    res.json(subcategory);
  } catch (error) {
    res.status(400).send("Sub Category not updated.");
  }
};

exports.remove = async (req, res) => {
  try {
    const subcategory = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(`${subcategory.name} is deleted.`);
  } catch (error) {
    res.status(400).send("Sub Category not deleted.");
  }
};
