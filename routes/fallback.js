const express = require("express");

const { sendFallback } = require("../controller/fallback");

const router = express.Router();

router.all("/", sendFallback);

module.exports = router;
