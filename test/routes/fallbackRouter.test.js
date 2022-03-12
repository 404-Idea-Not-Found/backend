const { expect } = require("chai");
const request = require("supertest");

const app = require("../../app");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../../utils/constants");

describe("fallback", () => {
  it("fallback should work for wrong url", async () => {
    const response = await request(app).get("/wrongUrl");

    expect(response.status).to.equal(404);
    expect(response.body).to.eql({
      result: RESPONSE_RESULT.ERROR,
      reason: ERROR_MESSAGES.FAILED_TO_ROUTE_REQUEST,
    });
  });
});
