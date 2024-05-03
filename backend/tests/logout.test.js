const request = require("supertest");
const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const mongoose = require("mongoose");

describe("POST /logout tests", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(5001);
    await initializePredefinedAccounts();
  });

  it("should successfully logout and clear the cookie", async () => {
    // Simulate login to set cookie
    await request(app)
      .post("/login")
      .send({ email: "staff@example.com", password: "staffPassword123" })
      .expect(200);

    // Test logout
    const logoutRes = await request(app)
      .post(`/logout`)
      .expect("Content-Type", /json/);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe("Logout successful");

    // Check if the cookie was cleared correctly
    expect(logoutRes.headers["set-cookie"]).toBeDefined();
    const cookie = logoutRes.headers["set-cookie"].toString();
    expect(cookie.includes("accountId=;")).toBeTruthy(); // Check for the cookie being set to an empty value
    expect(cookie.includes("Expires=")).toBeTruthy(); // Check for an immediate expiry
  });

  it("should return successful logout even if no cookie is present", async () => {
    // Ensure no cookie is sent with the request
    const logoutRes = await request(app)
      .post(`/logout`)
      .expect("Content-Type", /json/);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe("Logout successful");
    expect(logoutRes.headers["set-cookie"]).toBeDefined();
    const cookie = logoutRes.headers["set-cookie"].toString();
    expect(cookie.includes("accountId=;")).toBeTruthy();
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
