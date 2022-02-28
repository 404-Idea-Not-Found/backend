const User = require("../model/User");

exports.checkUser = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (verificationResult) => {
  return await User.create({
    username: verificationResult.name,
    email: verificationResult.email,
    profilePicture: verificationResult.picture,
  });
};
