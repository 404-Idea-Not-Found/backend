/* eslint-disable no-unused-vars */
const { createServer } = require("http");

const { assert, expect } = require("chai");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

const handleCanvasEvent = require("../../config/socketEventHandlers/handleCanvasEvent");
const handleChatEvent = require("../../config/socketEventHandlers/handleChatEvent");
const handleConnection = require("../../config/socketEventHandlers/handleConnection");
const handleControlPanelEvent = require("../../config/socketEventHandlers/handleControlPanelEvent");
const handleWebRtcEvent = require("../../config/socketEventHandlers/handleWebRtcEvent");
const checkDB = require("../../middlewares/socket/checkDB");
const Meeting = require("../../model/Meeting");
const { ERROR_MESSAGES } = require("../../utils/constants");
const { mockMeetingList, mockUserList } = require("../mockData");

describe("Socket", function () {
  this.timeout(3000);

  let io, clientSocket;
  let port;

  before(() => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      port = httpServer.address().port;
      io.use(checkDB);
      io.on("connection", (socket) => {
        handleConnection(socket);
        handleCanvasEvent(socket);
        handleControlPanelEvent(socket);
        handleChatEvent(socket);
        handleWebRtcEvent(socket);
      });
    });
  });

  afterEach(() => {
    if (clientSocket) clientSocket.disconnect();
  });

  describe("connection", () => {
    it("should throw error when handshake includes wrong data", function (done) {
      this.timeout(5000);
      const testId = "wrongId";

      clientSocket = Client(`http://localhost:${port}?userId=${testId}`);
      clientSocket.on("connect_error", (reason) => {
        expect(reason.data).to.equal(
          ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        );
        done();
      });
    });

    it("should join room when connected", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const testUserId = mockUserList[0]._id;

      clientSocket = Client(
        `http://localhost:${port}?userId=${testUserId}&room=${testRoom}`
      );
      clientSocket.on("join", (room) => {
        expect(room).to.equal(testRoom);
        done();
      });
    });

    it("should update meeting status in DB when owner disconected", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const participantUserId = mockUserList[1]._id;

      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      const participantSocket = Client(
        `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
      );

      ownerSocket.on("connect", async () => {
        const meeting = await Meeting.findById(testRoom);
        expect(meeting.ownerSocketId).to.equal(ownerSocket.id);
      });

      participantSocket.on("connect", () => {
        ownerSocket.disconnect();
      });

      participantSocket.on("ownerDisconnected", async () => {
        const meeting = await Meeting.findById(testRoom);
        expect(meeting.ownerSocketId).to.equal(null);
        participantSocket.disconnect();
        done();
      });
    });

    it("should broad cast meeting owner disconnection to everybody in the room", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const participantUserId = mockUserList[1]._id;

      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      const participantSocket = Client(
        `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
      );

      participantSocket.on("connect", () => {
        ownerSocket.disconnect();
      });

      participantSocket.on("ownerDisconnected", () => {
        done();
        participantSocket.disconnect();
      });
    });

    it("should set owner socketId in the DB when meeting owner is connected", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;

      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      ownerSocket.on("connect", async () => {
        const meeting = await Meeting.findById(testRoom);

        expect(meeting.ownerSocketId).to.equal(ownerSocket.id);
        ownerSocket.disconnect();
        done();
      });
    });

    it("should not set owner socketId in the DB when participant is connected", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const participantUserId = mockUserList[1]._id;

      const participantSocket = Client(
        `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}&isOwner=${false}`
      );

      participantSocket.on("connect", async () => {
        const meeting = await Meeting.findById(testRoom);

        expect(meeting.ownerSocketId).to.equal(null);
        participantSocket.disconnect();
        done();
      });
    });
  });

  describe("chatEvent", () => {
    it("should save and emit every chat", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const participantUserId = mockUserList[1]._id;
      const testChat = {
        username: "participant",
        text: "participantText",
        date: new Date().toISOString(),
      };

      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      const participantSocket = Client(
        `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
      );

      ownerSocket.on("chatReceived", async (chat) => {
        const meeting = await Meeting.findById(testRoom);

        expect(chat).to.eql(testChat);
        expect(meeting.chatList[0].username).to.eql(testChat.username);
        expect(meeting.chatList[0].text).to.eql(testChat.text);

        ownerSocket.disconnect();
        participantSocket.disconnect();

        done();
      });

      participantSocket.on("connect", () => {
        participantSocket.emit("chatSubmitted", testChat);
      });
    });
  });

  describe("controlPanel", () => {
    it("should allow painting request", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const { _id: participantUserId, username: participantUsername } =
        mockUserList[1];

      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      const participantSocket = Client(
        `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
      );

      ownerSocket.on("paintRequest", ({ username, requestorSocketId }) => {
        expect(username).to.equal(participantUsername);
        expect(requestorSocketId).to.equal(participantSocket.id);

        ownerSocket.disconnect();
        participantSocket.disconnect();
        done();
      });

      participantSocket.on("connect", () => {
        participantSocket.emit("paintRequest", {
          meetingId: testRoom,
          username: participantUsername,
        });
      });
    });
  });

  describe("requestRecruitment", () => {
    it("should update DB and emit request to owner", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const { _id: participantUserId, username: participantUsername } =
        mockUserList[1];

      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      let participantSocket;

      ownerSocket.on("connect", () => {
        participantSocket = Client(
          `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
        );

        participantSocket.on("connect", () => {
          participantSocket.emit("requestRecruitment", participantUsername);
        });
      });

      ownerSocket.on(
        "requestRecruitment",
        async ({ username, userId, requestorSocketId }) => {
          const meeting = await Meeting.findById(testRoom);
          expect(String(meeting.colleague[0]._id)).to.equal(participantUserId);
          expect(username).to.equal(participantUsername);
          expect(userId).to.equal(participantUserId);
          expect(requestorSocketId).to.equal(participantSocket.id);
          done();
        }
      );
    });

    it("should not update DB and emit request to owner when recruit number is full", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const mockUserId1 = "5fa1c587ae2ac23e9c46510f";
      const mockUserId2 = "5fa1c587ae2ac23e9c46510f";
      const mockUserId3 = "5fa1c587ae2ac23e9c46510f";
      const mockUserId4 = "5fa1c587ae2ac23e9c46510f";
      const mockUserId5 = "5fa1c587ae2ac23e9c46510f";
      const mockUserId6 = "5fa1c587ae2ac23e9c46510f";
      const { _id: participantUserId, username: participantUsername } =
        mockUserList[1];
      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      let participantSocket;

      ownerSocket.on("connect", async () => {
        await Meeting.findByIdAndUpdate(testRoom, {
          $push: {
            colleague: {
              $each: [
                mockUserId1,
                mockUserId2,
                mockUserId3,
                mockUserId4,
                mockUserId5,
                mockUserId6,
              ],
            },
          },
        });

        participantSocket = Client(
          `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
        );

        participantSocket.on("recruitFull", () => {
          ownerSocket.disconnect();
          participantSocket.disconnect();
          done();
        });

        participantSocket.on("connect", () => {
          participantSocket.emit("requestRecruitment", participantUsername);
        });
      });
    });
  });

  describe("kickedFromRecuitList", () => {
    it("should be able to kick the user from recruit list", (done) => {
      const testRoom = mockMeetingList[0]._id;
      const ownerUserId = mockUserList[0]._id;
      const { _id: participantUserId, username: participantUsername } =
        mockUserList[1];
      const ownerSocket = Client(
        `http://localhost:${port}?userId=${ownerUserId}&room=${testRoom}&isOwner=${true}`
      );

      let participantSocket;

      ownerSocket.on("connect", async () => {
        participantSocket = Client(
          `http://localhost:${port}?userId=${participantUserId}&room=${testRoom}`
        );

        participantSocket.on("kickedFromRecuitList", () => {
          ownerSocket.disconnect();
          participantSocket.disconnect();
          done();
        });

        participantSocket.on("connect", () => {
          participantSocket.emit("requestRecruitment", participantUsername);
        });

        ownerSocket.on(
          "requestRecruitment",
          ({ username, userId, requestorSocketId }) => {
            expect(username).to.equal(participantUsername);
            expect(userId).to.equal(participantUserId);
            expect(requestorSocketId).to.equal(participantSocket.id);

            ownerSocket.emit("kickRecruit", {
              socketId: requestorSocketId,
              userId: participantUserId,
            });
          }
        );
      });
    });
  });
});
