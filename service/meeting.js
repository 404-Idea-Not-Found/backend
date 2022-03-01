const Meeting = require("../model/Meeting");

exports.getMeetingList = async (lastId) => {
  if (lastId !== "firstQuery") {
    return await Meeting.find({ _id: { $gt: lastId }, isEnd: false })
      .sort({ _id: 1 })
      .limit(10);
  }

  return await Meeting.find({ isEnd: false }).sort({ _id: 1 }).limit(10);
};
