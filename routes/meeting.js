const express = require("express");
const router = express.Router();

const { sendMeetingList } = require("../controller/meeting");

router.get("/meeting-list", sendMeetingList);

module.exports = router;
