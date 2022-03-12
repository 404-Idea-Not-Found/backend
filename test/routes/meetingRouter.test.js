const { expect } = require("chai");
const httpMocks = require("node-mocks-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const request = require("supertest");

const app = require("../../app");
const Meeting = require("../../model/Meeting");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");
const signToken = require("../../utils/signToken");
const {
  mockMeetingList,
  mockUserList,
  reservedMeetingMock,
  pastMeetingMock,
  participatingProjectMock,
} = require("../mockData");

describe("/meeting", () => {
  const validToken = signToken(mockUserList[0]._id);

  describe("GET", () => {
    describe("/meeting-list", () => {
      it("should return all 'un-end' meeting list from db with first query", async () => {
        const response = await request(app).get(
          "/meeting/meeting-list?lastId=firstQuery"
        );

        expect(response.status).to.equal(200);
        expect(response.body.meetingList[0]._id).to.equal(
          mockMeetingList[0]._id
        );
        expect(response.body.meetingList[1]._id).to.equal(
          mockMeetingList[1]._id
        );
      });

      it("should return all 'un-end' meeting list from db with subsequent query", async () => {
        const firstId = mockMeetingList[0]._id;
        const secondId = mockMeetingList[1]._id;
        const response = await request(app).get(
          `/meeting/meeting-list?lastId=${firstId}`
        );

        expect(response.status).to.equal(200);
        expect(response.body.meetingList[0]._id).to.equal(secondId);
      });

      it("should return nothing when subsequent query's lastId is the end", async () => {
        const secondId = mockMeetingList[1]._id;
        const response = await request(app).get(
          `/meeting/meeting-list?lastId=${secondId}`
        );

        expect(response.status).to.equal(200);
        expect(response.body.meetingList).to.eql([]);
      });

      it("should throw error when db error happened", async () => {
        const wrongId = "wrongId";
        const response = await request(app).get(
          `/meeting/meeting-list?lastId=${wrongId}`
        );

        expect(response.status).to.equal(500);
        expect(response.body.result).to.equal(RESPONSE_RESULT.ERROR);
        expect(response.body.errorMessage).to.equal(
          ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        );
      });
    });

    describe("/my-page", () => {
      it("should return my-page meeting list", async () => {
        const { _id: mockUserId, email: mockUserEmail } = mockUserList[0];

        await Meeting.create([
          reservedMeetingMock,
          pastMeetingMock,
          participatingProjectMock,
        ]);

        const response = await request(app)
          .get(`/meeting/my-page?userId=${mockUserId}&email=${mockUserEmail}`)
          .set("Authorization", `Bearer ${validToken}`);

        const {
          plannedMeeting,
          pastMeeting,
          reservedMeeting,
          participatingProject,
        } = response.body.catagorizedMyPageMeeting;

        await Meeting.create();
        expect(plannedMeeting[0]._id).to.equal(mockMeetingList[0]._id);
        expect(pastMeeting[0]._id).to.equal(pastMeetingMock._id);
        expect(reservedMeeting[0]._id).to.equal(reservedMeetingMock._id);
        expect(participatingProject[0]._id).to.equal(
          participatingProjectMock._id
        );
      });

      it("should return error when failed", async () => {
        const wrongUserID = "wrongId";
        const response = await request(app)
          .get(`/meeting/my-page?userId=${wrongUserID}`)
          .set("Authorization", `Bearer ${validToken}`);

        expect(response.status).to.equal(500);
        expect(response.body.result).to.equal(RESPONSE_RESULT.ERROR);
        expect(response.body.errorMessage).to.equal(
          ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        );
      });
    });

    describe("/:meetingId", () => {
      it("should return the meeting with the same id", async () => {
        const mockId = mockMeetingList[0]._id;
        const response = await request(app).get(`/meeting/${mockId}`);

        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal(RESPONSE_RESULT.OK);
        expect(response.body.meeting._id).to.equal(mockId);
      });

      it("should fails with the wrong id", async () => {
        const response = await request(app).get("/meeting/wrongId");

        expect(response.status).to.equal(500);
        expect(response.body.result).to.equal(RESPONSE_RESULT.ERROR);
        expect(response.body.errorMessage).to.equal(
          ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        );
      });
    });
  });

  describe("POST", () => {
    let mockRequest = httpMocks.createRequest({
      method: "POST",
    });
    let mockResponse = httpMocks.createResponse();
    let fakeExpressNext = sinon.fake((error) => {
      mockResponse.statusCode = error.status;
      mockResponse.errorMessage = error.message;
    });

    afterEach(function () {
      mockRequest = httpMocks.createRequest({
        method: "POST",
      });
      mockResponse = httpMocks.createResponse();
      fakeExpressNext = sinon.fake((error) => {
        mockResponse.statusCode = error.status;
        mockResponse.errorMessage = error.message;
      });
    });

    describe("/new-meeting", () => {
      it("should create new meeting when provided with right input", async () => {
        const mockId = mockMeetingList[0]._id;
        const testTitle = "testTitle";
        const createNewMeeting = proxyquire("../../controller/meeting", {
          "../api/mailJobAPI": {
            createMailJob: () => {},
          },
        }).createNewMeeting;
        const mockMeetingData = {
          title: testTitle,
          tag: "testTag",
          description: "testDesctestDesctestDesctestDesc",
          recruitmentNumber: 1,
          startTime: new Date().toISOString(),
        };

        mockRequest.userInfo = { fourOFourToken: "testToken", _id: mockId };
        mockRequest.body = { meetingData: mockMeetingData };

        await createNewMeeting(mockRequest, mockResponse);

        expect(mockResponse._getStatusCode()).to.equal(200);
        expect(mockResponse._getJSONData().createdMeeting.title).to.equal(
          testTitle
        );
      });

      it("should fail when provided with wrong input", async () => {
        const mockId = mockMeetingList[0]._id;
        const tooShortDescription = "short";
        const createNewMeeting = proxyquire("../../controller/meeting", {
          "../api/mailJobAPI": {
            createMailJob: () => {},
          },
        }).createNewMeeting;
        const mockMeetingData = {
          title: "test",
          tag: "testTag",
          description: tooShortDescription,
          recruitmentNumber: 1,
          startTime: new Date().toISOString(),
        };

        mockRequest.userInfo = { fourOFourToken: "testToken", _id: mockId };
        mockRequest.body = { meetingData: mockMeetingData };

        await createNewMeeting(mockRequest, mockResponse, fakeExpressNext);

        expect(mockResponse.statusCode).to.equal(400);
        expect(mockResponse.errorMessage).to.include(
          ERROR_MESSAGES.FAILED_TO_VALIDATE_DB_FIELD
        );
      });
    });
  });
});
