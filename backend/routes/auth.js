const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { getDb } = require("../db");

const router = Router();

const createToken = () => {
  return jwt.sign({}, "secret", { expiresIn: "1h" });
};

router.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    // Check if user login is valid
    const user = await getDb().db().collection("users").findOne({ email });
    // If yes, create token and return it to client
    const result = await bcrypt.compare(pw, user.password);
    if (result) {
      const token = createToken();
      res
        .status(200)
        .json({ token: token, message: "Authentication succeeded" });
    }
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed, invalid username or password."
    });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    // Hash password before storing it in database => Encryption at Rest
    const hashedPW = await bcrypt.hash(pw, 12);
    // Store hashedPW in database
    console.log(hashedPW);
    await getDb()
      .db()
      .collection("users")
      .insertOne({ email, password: hashedPW });
    const token = createToken();
    res.status(201).json({ token: token, user: { email: email } });
  } catch (error) {
    res.status(500).json({ message: "Creating the user failed." });
    console.log(error);
  }
});

module.exports = router;
