const slugify = require("slugify");
const Product = require("../models/Product");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.name);
    const product = await new Product(req.body);
    product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subcategory")
      .sort([["createdAt", "desc"]])
      .exec();

    res.json(products);
  } catch (error) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();

    res.json("product deleted.", product);
  } catch (error) {
    console.log(error);
    res.status(400).json("Product delete failed.");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
  })
    .populate("category")
    .populate("subcategory")
    .exec();

  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const product = await Product.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      req.body,
      { new: true }
    );

    product.save();
    res.json("product updated.", product);
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subcategory")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.total = async (req, res) => {
  try {
    const totalCount = await Product.estimatedDocumentCount().exec();

    res.json(totalCount);
  } catch (err) {
    console.log(err);
  }
};

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    const existingRating = product.ratings.find(
      (el) => el.postedBy.toString() === user._id.toString()
    );

    if (existingRating === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        { $push: { ratings: { star, postedBy: user._id } } },
        { new: true }
      ).exec();

      res.json(ratingAdded);
    } else {
      // update ratings
      const ratingUpdate = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRating },
        },
        {
          $set: { "ratings.$.star": star },
        },
        { new: true }
      ).exec();

      res.json(ratingUpdate);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
};

async function handleQuery(req, res, query) {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handlePrice(req, res, price) {
  const products = await Product.find({
    price: { $gte: price[0], $lte: price[1] },
  })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handleCategory(req, res, category) {
  const products = await Product.find({ category })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handleStars(req, res, stars) {
  const aggregates = await Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ]).limit(10);

  const products = await Product.find({ _id: aggregates })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handleSubcategory(req, res, subcategory) {
  const products = await Product.find({ subcategory: subcategory })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handleBrand(req, res, brand) {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handleColor(req, res, color) {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

async function handleShipping(req, res, shipping) {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
}

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, subcategory, brand, color, shipping } =
    req.body;

  if (query) {
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    await handlePrice(req, res, price);
  }

  if (category) {
    await handleCategory(req, res, category);
  }

  if (stars) {
    await handleStars(req, res, stars);
  }

  if (subcategory) {
    await handleSubcategory(req, res, subcategory);
  }

  if (brand) {
    await handleBrand(req, res, brand);
  }

  if (color) {
    await handleColor(req, res, color);
  }

  if (shipping) {
    await handleShipping(req, res, shipping);
  }
};
