const Router = require("express").Router;
const mongodb = require("mongodb");

const { getDb } = require("../db");

const router = Router();

// Get list of products products
router.get("/", async (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  // const queryPage = req.query.page;
  // const pageSize = 5;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  try {
    const products = [];
    await getDb()
      .db()
      .collection("products")
      .find()
      .forEach(product => {
        product.price = product.price.toString();
        products.push(product);
      });
    res.status(201).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single product
router.get("/:id", (req, res, next) => {
  const product = products.find(p => p._id === req.params.id);
  res.json(product);
});

// Add new product
// Requires logged in user
router.post("", async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: mongodb.Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  try {
    const result = await getDb()
      .db()
      .collection("products")
      .insertOne(newProduct);

    res
      .status(201)
      .send({ message: "Product added", productId: result.insertedId });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(updatedProduct);
  res.status(200).json({ message: "Product updated", productId: "DUMMY" });
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  res.status(200).json({ message: "Product deleted" });
});

module.exports = router;
