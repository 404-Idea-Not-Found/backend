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
      .select("-reservation -chatList -description")
      .limit(10)
      .lean();
  }

  return await Meeting.find({
    isEnd: false,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { tag: { $regex: query, $options: "i" } },
    ],
  })
    .sort({ _id: 1 })
    .select("-reservation -chatList -description")
    .limit(10)
    .lean();
};

exports.getMeeting = async (meetingId) => {
  return await Meeting.findById(meetingId).lean();
};

exports.getMyPageMeeting = async (userId, email) => {
  const myPageMeetingList = await Meeting.find({
    $or: [
      { owner: userId, isEnd: false },
      { owner: userId, isEnd: true },
      {
        reservation: { $in: email },
        isEnd: false,
      },
      {
        colleague: userId,
        isEnd: true,
      },
    ],
  })
    .select("-chatList -tag")
    .populate("colleague");

  const catagorizedMyPageMeeting = {
    plannedMeeting: [],
    pastMeeting: [],
    reservedMeeting: [],
    participatingProject: [],
  };

  for (const meeting of myPageMeetingList) {
    if (String(meeting.owner) === userId && !meeting.isEnd) {
      catagorizedMyPageMeeting.plannedMeeting.push(meeting);
      continue;
    }

    if (String(meeting.owner) === userId && meeting.isEnd) {
      catagorizedMyPageMeeting.pastMeeting.push(meeting);
    }

    if (
      meeting.colleague.length &&
      meeting.isEnd &&
      String(meeting.owner) === userId
    ) {
      catagorizedMyPageMeeting.participatingProject.push(meeting);
      continue;
    }

    if (meeting.reservation.includes(email) && !meeting.isEnd) {
      catagorizedMyPageMeeting.reservedMeeting.push(meeting);
      continue;
    }

    const isColleague = meeting.colleague.some(
      (colleague) => String(colleague._id) === userId
    );

    if (isColleague && meeting.isEnd) {
      catagorizedMyPageMeeting.participatingProject.push(meeting);
      continue;
    }
  }

  return catagorizedMyPageMeeting;
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

exports.endMeeting = async (meetingId) => {
  await Meeting.findByIdAndUpdate(meetingId, { isEnd: true, isLive: false });
};

exports.deleteMeeting = async (meetingId) => {
  return await Meeting.findByIdAndDelete(meetingId);
};
