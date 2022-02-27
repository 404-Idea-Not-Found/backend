const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.json("hello 404 Idea Not Found!");
});

module.exports = router;
