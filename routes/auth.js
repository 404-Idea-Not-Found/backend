const express = require("express");
const router = express.Router();

const { googleAuth, sendVerified } = require("../controller/auth");
const verify404Token = require("../middlewares/verify404Token");

router.post("/verify-404-token", verify404Token, sendVerified);
router.post("/google", googleAuth);

module.exports = router;
