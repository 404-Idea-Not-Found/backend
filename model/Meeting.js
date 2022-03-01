const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
  },
  description: {
    type: String,
    maxlength: 300,
    minlength: 10,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  reservation: {
    type: [mongoose.ObjectId],
    ref: "User",
    default: [],
  },
  colleague: {
    type: [mongoose.ObjectId],
    ref: "User",
    default: [],
  },
  recruitmentNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  startTime: {
    type: Date,
    required: true,
  },
  chatList: {
    type: [chatSchema],
    default: [],
  },
  doodle: {
    type: String,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  isEnd: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Meeting", meetingSchema);
