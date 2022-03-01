const express = require("express");
const router = express.Router();

const { sendMeetingList } = require("../controller/meeting");

router.get("/meeting-list/:lastId", sendMeetingList);

module.exports = router;
