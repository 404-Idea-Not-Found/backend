const express = require("express");

const router = express.Router();

const {
  sendMeetingList,
  sendMeeting,
  createNewMeeting,
  reserveMeeting,
  cancelReservation,
  terminateMeeting,
  sendMyPageMeeting,
} = require("../controller/meeting");
const verify404Token = require("../middlewares/express/verify404Token");

router.get("/meeting-list", sendMeetingList);
router.get("/my-page", verify404Token, sendMyPageMeeting);
router.get("/:meetingId", sendMeeting);

router.post("/new-meeting", verify404Token, createNewMeeting);
router.post("/reservation/:meetingId", verify404Token, reserveMeeting);
router.post("/termination/:meetingId", verify404Token, terminateMeeting);

router.patch("/reservation/:meetingId", verify404Token, cancelReservation);

module.exports = router;
