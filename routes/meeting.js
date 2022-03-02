const express = require("express");
const router = express.Router();

const { sendMeetingList, sendMeeting } = require("../controller/meeting");

router.get("/meeting-list", sendMeetingList);
router.get("/:meetingId", sendMeeting);

module.exports = router;
