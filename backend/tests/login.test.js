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

  it("Login with invalid email", async () => {
    const loginRes = await request(app).post(`/login`).send({
      email: "staf@example.com",
      password: dummyPassword,
    });

    expect(loginRes.status).toBe(400);
    expect(loginRes.body).toHaveProperty("message");
    expect(loginRes.body.message).toBe("Incorrect email or password.");
  });

  it("Login with invalid password", async () => {
    const loginRes = await request(app).post(`/login`).send({
      email: dummyEmail,
      password: "abcde",
    });

    expect(loginRes.status).toBe(400);
    expect(loginRes.body).toHaveProperty("message");
    expect(loginRes.body.message).toBe("Incorrect email or password.");
  });

  it("Login with valid credentials", async () => {
    const loginRes = await request(app)
      .post(`/login`)
      .withCredentials()
      .send({
        email: dummyEmail,
        password: dummyPassword,
      })
      .expect("Content-Type", /json/);

    expect(loginRes.status).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    expect(loginRes.body).toHaveProperty("account");
    const retUser = loginRes.body.account;
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

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
