const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  obj = {
    a: "AKhilesh",
    number: 33,
  };
  res.json(obj);
});

module.exports = router;
