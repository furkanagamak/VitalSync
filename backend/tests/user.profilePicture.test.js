const supertest = require("supertest");
// const app = require("../server.js");
const request = supertest("http://localhost:5000");

describe("PUT /user/profilePicture endpoint testing", () => {
  it("Unauthorized requests should be rejected with error message", async () => {
    const res = await request.put("/user/profilePicture").expect(400);
    expect(res.text).toEqual("User not logged in");
  });
});
