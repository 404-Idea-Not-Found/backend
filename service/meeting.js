const Meeting = require("../model/Meeting");

exports.getMeetingList = async (query, lastId) => {
  if (lastId !== "firstQuery") {
    return await Meeting.find({
      _id: { $gt: lastId },
      isEnd: false,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tag: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ _id: 1 })
      .select("-reservation -chatList -doodle -description")
      .limit(10);
  }

  return await Meeting.find({
    isEnd: false,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { tag: { $regex: query, $options: "i" } },
    ],
  })
    .sort({ _id: 1 })
    .select("-reservation -chatList -doodle -description")
    .limit(10);
};

exports.getMeeting = async (meetingId) => {
  return await Meeting.findById(meetingId);
};

exports.createMeeting = async (userId, meetingData) => {
  const { title, tag, description, recruitmentNumber, startTime } = meetingData;

  return await Meeting.create({
    title,
    tag,
    description,
    owner: userId,
    recruitmentNumber,
    startTime,
  });
};

exports.addUserReservation = async (email, meetingId) => {
  await Meeting.findByIdAndUpdate(meetingId, {
    $addToSet: { reservation: email },
  });
};

exports.removeUserReservation = async (email, meetingId) => {
  await Meeting.findByIdAndUpdate(meetingId, {
    $pull: { reservation: email },
  });
};
