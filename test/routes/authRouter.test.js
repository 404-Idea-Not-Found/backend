const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const httpMocks = require("node-mocks-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
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

describe("/google", () => {
  describe("success", () => {
    let request = httpMocks.createRequest({
      method: "POST",
      url: "/auth/google",
    });
    let response = httpMocks.createResponse();
    let fakeExpressNext = sinon.fake((error) => {
      response.statusCode = error.status;
      response.json();
    });

    afterEach(function () {
      request = httpMocks.createRequest({
        method: "POST",
        url: "/auth/google",
      });
      response = httpMocks.createResponse();
      fakeExpressNext = sinon.fake((error) => {
        response.statusCode = error.status;
        response.errorMessage = error.message;
      });
    });

    it("should success with valid firebase authentication", async () => {
      const validUserEmail = mockUserList[0].email;
      const firebaseStub = sinon.stub().returns({
        verifyIdToken: sinon.stub().returns({
          email: validUserEmail,
        }),
      });
      const googleAuth = proxyquire("../../controller/auth", {
        "firebase-admin/auth": { getAuth: firebaseStub },
      }).googleAuth;

      await googleAuth(request, response);
      expect(response._getStatusCode()).to.equal(200);
      expect(response._getJSONData().result).to.equal(RESPONSE_RESULT.OK);
      expect(response._getJSONData().email).to.equal(validUserEmail);
    });

    it("should fail when firebase authentication fails", async () => {
      const testError = "helloError";
      const firebaseStub = sinon.stub().returns({
        verifyIdToken: sinon.stub().rejects(new Error(testError)),
      });

      const googleAuth = proxyquire("../../controller/auth", {
        "firebase-admin/auth": { getAuth: firebaseStub },
      }).googleAuth;

      await googleAuth(request, response, fakeExpressNext);
      expect(response.statusCode).to.equal(500);
      expect(response.errorMessage).to.equal(
        ERROR_MESSAGES.FAILED_TO_AUTHENTICATE_WITH_GOOGLE
      );
    });
  });
});
