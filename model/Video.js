/* eslint-disable no-useless-escape */
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  ownerSocketId: {
    type: String,
  },
});

module.exports = mongoose.model("video", videoSchema);
