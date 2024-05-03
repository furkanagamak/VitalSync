const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const Account = require("../models/account");

describe("PUT /user/:userId update user profile", () => {
  let server;
  let uids;

  // Setup a server and create predefined accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Update with valid data", async () => {
    const newData = {
      firstName: "UpdatedName",
      lastName: "UpdatedLastName",
    };

    const updateRes = await request(app).put(`/user/${uids[0]}`).send(newData);

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty("message");
    expect(updateRes.body.message).toBe("Profile updated successfully");
    expect(updateRes.body.user).toHaveProperty("firstName", "UpdatedName");
    expect(updateRes.body.user).toHaveProperty("lastName", "UpdatedLastName");
  });

  it("Update with invalid userId", async () => {
    const newData = {
      firstName: "NonexistentUser",
    };

    const updateRes = await request(app)
      .put(`/user/invalidUserId`)
      .send(newData);

    expect(updateRes.status).toBe(500);
    expect(updateRes.body).toHaveProperty("message");
    expect(updateRes.body.message).toBe("Error updating user");
  });

  it("Database failure during update", async () => {
    const newData = {
      firstName: "ShouldFail",
    };

    // Simulate a database failure by mocking Mongoose methods
    jest
      .spyOn(Account, "findByIdAndUpdate")
      .mockRejectedValue(new Error("Database failure"));

    const updateRes = await request(app).put(`/user/${uids[0]}`).send(newData);

    expect(updateRes.status).toBe(500);
    expect(updateRes.body).toHaveProperty("message");
    expect(updateRes.body.message).toBe("Error updating user");

    // Restore original function
    jest.restoreAllMocks();
  });

  // Cleanup after tests
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
