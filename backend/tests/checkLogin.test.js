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

  it("Login and then request checkLogin", async () => {
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
    const checkLoginRes = await request(app)
      .get("/checkLogin")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .expect("Content-Type", /json/);

    expect(checkLoginRes.status).toBe(200);

    const body = checkLoginRes.body;

    expect(body).toHaveProperty("isLoggedIn");
    expect(body.isLoggedIn).toBe(true);

    expect(body).toHaveProperty("account");
    const retUser = body.account;
    expect(retUser).toHaveProperty("id");
    expect(retUser.id).toBe(uids[0]);
    expect(retUser).toHaveProperty("firstName");
    expect(retUser.firstName).toBe("Staff");
    expect(retUser).toHaveProperty("lastName");
    expect(retUser.lastName).toBe("User");
    expect(retUser).toHaveProperty("accountType");
    expect(retUser.accountType).toBe("staff");
    expect(retUser).toHaveProperty("profileUrl");
    expect(retUser.profileUrl).toBe("");
  });

  it("checkLogin without login", async () => {
    const loginRes = await request(app).get(`/checkLogin`);

    expect(loginRes.status).toBe(200);

    const body = loginRes.body;
    expect(body).toHaveProperty("isLoggedIn");
    expect(body.isLoggedIn).toBe(false);

    expect(body).not.toHaveProperty("account");
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
