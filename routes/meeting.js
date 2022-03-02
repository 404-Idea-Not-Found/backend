const express = require("express");

const router = express.Router();

const {
  sendMeetingList,
  sendMeeting,
  createNewMeeting,
} = require("../controller/meeting");
const verify404Token = require("../middlewares/verify404Token");

router.get("/meeting-list", sendMeetingList);
router.get("/:meetingId", sendMeeting);
router.post("/new-meeting", verify404Token, createNewMeeting);

module.exports = router;
