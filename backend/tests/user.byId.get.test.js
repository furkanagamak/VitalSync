const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");

describe("GET /user/:userId", () => {
  let server;
  let uids;

  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Fetch user by ID successfully", async () => {
    const userId = uids[0];
    const res = await request(app).get(`/user/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId", userId);
    expect(res.body).toHaveProperty("firstName");
    expect(res.body).toHaveProperty("lastName");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("department");
    expect(res.body).toHaveProperty("degree");
    expect(res.body).toHaveProperty("phoneNumber");
    expect(res.body).toHaveProperty("officePhoneNumber");
    expect(res.body).toHaveProperty("officeLocation");
    expect(res.body).toHaveProperty("usualHours");
    expect(res.body).toHaveProperty("unavailableTimes");
  });

  it("Return 404 if user does not exist", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId(); // Generate a random ObjectId
    const res = await request(app).get(`/user/${nonExistentUserId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  it("Handle unexpected errors", async () => {
    const faultyUserId = "bad_id"; // A faulty user ID to trigger an error
    const res = await request(app).get(`/user/${faultyUserId}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Error fetching user");
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
