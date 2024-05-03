const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");

describe("GET /users - User Listing", () => {
  let server;
  let predefinedAccountIds;

  // Start server and create predefined accounts
  beforeAll(async () => {
    server = app.listen(5001);
    predefinedAccountIds = await initializePredefinedAccounts();
  });

  // Test to fetch all users successfully
  it("should fetch all users successfully", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((user) => {
      expect(user).toHaveProperty("firstName");
      expect(user).toHaveProperty("lastName");
      expect(user).toHaveProperty("department");
      expect(user).toHaveProperty("position");
      expect(user).toHaveProperty("isTerminated");
    });
  });

  it("should handle the presence of a default user", async () => {
    await removePredefinedAccounts(); // Clean out all accounts for this test
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2); // Expecting one user
    expect(response.body[0]).toHaveProperty("firstName", "John"); // Check properties of the default user
  });

  // Test error handling if there is a database issue
  it("should handle database errors", async () => {
    // Mock a database failure by interfering with mongoose's find method
    const originalFind = mongoose.Model.find;
    mongoose.Model.find = jest.fn().mockImplementationOnce(() => {
      throw new Error("Simulated database failure");
    });

    const response = await request(app).get("/users");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Error fetching users");

    // Restore the original find method after test
    mongoose.Model.find = originalFind;
  });

  // Cleanup: remove dummy accounts and close server connection
  afterAll(async () => {
    await removePredefinedAccounts(); // Ensure any test data is cleaned up
    await server.close();
    await mongoose.disconnect();
  });
});
