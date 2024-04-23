const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");

describe("GET /user/profilePicture/url/:id get signed profile picture url", () => {
  // Dummy account credentials
  const dummyEmail = "staff@example.com";
  const dummyPassword = "staffPassword123";
  let server;
  let uids;

  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Getting image of invalid user id", async () => {
    const profileUrlRes = await request(app).get(
      `/user/profilePicture/url/abcde`
    );
    expect(profileUrlRes.status).toBe(404);
    expect(profileUrlRes.text).toBeDefined();
    expect(profileUrlRes.text).toBe("User not found");
  });

  it("Getting image of user 1 before they have updated their image", async () => {
    const profileUrlRes = await request(app).get(
      `/user/profilePicture/url/${uids[0]}`
    );
    expect(profileUrlRes.status).toBe(200);
    expect(profileUrlRes.text).toBeDefined();
    expect(profileUrlRes.text).toBe("");
  });

  it("Getting image of user 1 after they have updated their image", async () => {
    // Log in with dummy account to get a valid session
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });

    // Extract accountId from the response cookies
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // Upload profile picture with a dummy image
    const uploadRes = await request(app)
      .put("/user/profilePicture")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .attach(
        "image",
        fs.readFileSync(__dirname + "/profilepic.png"),
        "profilepic.png"
      )
      .on("error", (err) => console.log(err));

    const profileUrlRes = await request(app).get(
      `/user/profilePicture/url/${uids[0]}`
    );
    expect(profileUrlRes.text).toBeDefined();
    expect(profileUrlRes.text).not.toBe("");
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
