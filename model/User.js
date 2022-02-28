/* eslint-disable no-useless-escape */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Failed to validate email address",
    ],
  },
  profilePicture: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
