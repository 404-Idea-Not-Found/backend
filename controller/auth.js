const { getAuth } = require("firebase-admin/auth");

const { checkUser, createUser } = require("../service/auth");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorWithStatus");
const signToken = require("../utils/signToken");

exports.googleAuth = async (req, res, next) => {
  try {
    let user;
    const verificationResult = await getAuth().verifyIdToken(
      req.body.googleUserIdToken
    );

    user = await checkUser(verificationResult.email);

    if (!user) {
      user = await createUser(verificationResult);
    }

    const fourOFourToken = signToken(user._id);

    res.json({
      result: RESPONSE_RESULT.OK,
      fourOFourToken,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      _id: user._id,
    });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_AUTHENTICATE_WITH_GOOGLE
      )
    );
  }
};

exports.sendVerified = (req, res, next) => {
  res.json({
    _id: req.userInfo._id,
    result: RESPONSE_RESULT.TOKEN_VERIFIED,
    username: req.userInfo.username,
    email: req.userInfo.email,
    profilePicture: req.userInfo.profilePicture,
  });
};
