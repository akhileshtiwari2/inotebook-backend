const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "blackjackgoodb$oy";

//Create aUser using: POST "/api/auth/". Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      // Bcrypt function
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a New User
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      //JsonWebToken  JWT
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });

      //Catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occurred ");
    }
  }
);
module.exports = router;
