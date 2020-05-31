const Router = require("express").Router;
const mongodb = require("mongodb");

const { getDb } = require("../db");

const router = Router();
const ObjectId = mongodb.ObjectId;

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
      .sort({ _id: -1 })
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
router.get("/:id", async (req, res, next) => {
  try {
    const product = await getDb()
      .db()
      .collection("products")
      .findOne({ _id: new ObjectId(req.params.id) });
    product.price = product.price.toString();
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
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
router.patch("/:id", async (req, res, next) => {
  try {
    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: mongodb.Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
      image: req.body.image
    };
    await getDb()
      .db()
      .collection("products")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updatedProduct }
      );

    res
      .status(200)
      .send({ message: "Product updated", productId: req.params.id });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

// Delete a product
// Requires logged in user
router.delete("/:id", async (req, res, next) => {
  try {
    await getDb()
      .db()
      .collection("products")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).send({ message: "Product deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
