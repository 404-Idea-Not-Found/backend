const mongoose = require("mongoose");

const Meeting = require("../model/Meeting");
const User = require("../model/User");
const { mockMeetingList, mockUserList } = require("./mockData");

const mockMeetingIdList = [];
const mockUserIdList = [];

mockMeetingList.map((meeting) => {
  mockMeetingIdList.push(meeting._id);
});
mockUserList.map((user) => {
  mockUserIdList.push(user._id);
});

exports.mochaHooks = {
  async beforeAll() {
    mongoose.connect(process.env.LOCAL_DB_URL);
  },
  async beforeEach() {
    mongoose.connect(process.env.LOCAL_DB_URL);

    await Meeting.create(mockMeetingList);
    await User.create(mockUserList);
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      if (collectionName === "meetings") {
        await Meeting.deleteMany();
      }

      if (collectionName === "users") {
        await User.deleteMany();
      }
    }
  },
  async afterAll() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }

    Object.keys(mongoose.connection.models).forEach((modelName) => {
      delete mongoose.connection.models[modelName];
    });
  },
};
