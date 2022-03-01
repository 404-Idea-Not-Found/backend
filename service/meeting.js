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
