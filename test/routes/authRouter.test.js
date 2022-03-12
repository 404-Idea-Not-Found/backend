const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../../app");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const signToken = require("../../utils/signToken");
const { mockUserList } = require("../mockData");

describe("/verify-404-token", () => {
  describe("success", () => {
    it("should send verified user data when requested with valid token", async () => {
      const validUserId = mockUserList[0]._id;
      const validToken = signToken(mockUserList[0]._id);

      const response = await request(app)
        .post("/auth/verify-404-token")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal(RESPONSE_RESULT.TOKEN_VERIFIED);
      expect(response.body._id).to.equal(validUserId);
    });
  });

  describe("failure", () => {
    it("should fail when user didn't send token in header", async () => {
      const responseWithNoAuthorizatioinHeader = await request(app).post(
        "/auth/verify-404-token"
      );
      const responseWithAuthorizatioinheaderButNoToken = await request(app)
        .post("/auth/verify-404-token")
        .set("Authorization", `Bearer `);

      expect(responseWithNoAuthorizatioinHeader.status).to.equal(400);
      expect(responseWithNoAuthorizatioinHeader.body.result).to.equal(
        RESPONSE_RESULT.NO_TOKEN
      );
      expect(responseWithAuthorizatioinheaderButNoToken.status).to.equal(400);
      expect(responseWithAuthorizatioinheaderButNoToken.body.result).to.equal(
        RESPONSE_RESULT.NO_TOKEN
      );
    });

    it("should fail when user sent token with invalid userId", async () => {
      const invalidToken = signToken("invalidUserId");
      const response = await request(app)
        .post("/auth/verify-404-token")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.result).to.equal(RESPONSE_RESULT.ERROR);
      expect(response.body.errorMessage).to.equal(
        ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
      );
    });

    it("should fail when user sent token with userId of no user", async () => {
      const userIdOfNoOne = "621c5447d20d6d0d905e4f30";
      const invalidToken = signToken(userIdOfNoOne);
      const response = await request(app)
        .post("/auth/verify-404-token")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.result).to.equal(RESPONSE_RESULT.NO_USER);
      expect(response.body.errorMessage).to.equal(
        ERROR_MESSAGES.FAILED_TO_GET_USER
      );
    });

    it("should fail when user sent expired token", async () => {
      const validUserId = mockUserList[0]._id;
      const expiredToken = jwt.sign(
        { id: validUserId },
        process.env.JWT_SECRET,
        {
          expiresIn: 0,
        }
      );
      const response = await request(app)
        .post("/auth/verify-404-token")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(response.status).to.equal(400);
      expect(response.body.result).to.equal(RESPONSE_RESULT.ERROR);
      expect(response.body.errorMessage).to.equal(
        ERROR_MESSAGES.FAILED_TO_VERIFY_TOKEN
      );
    });
  });
});
