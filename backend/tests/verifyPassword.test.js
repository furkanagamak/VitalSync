const request = require("supertest");
const mongoose = require("mongoose");
const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const Account = require("../models/account.js");
const bcrypt = require("bcrypt");

describe("POST /verify-password password verification", () => {
  let server;
  let testUser;

  // Helper function to create a user
  async function createTestUser() {
    const hashedPassword = await bcrypt.hash("testPassword123", 10);
    const user = new Account({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: hashedPassword,
      accountType: "staff",
      position: "Developer",
      department: "Engineering",
      degree: "BSc Computer Science",
      phoneNumber: "1234567890",
    });
    await user.save();
    return user;
  }

  // Set up the server and create a test user
  beforeAll(async () => {
    server = app.listen(5001);
    testUser = await createTestUser();
  });

  it("should return true for a valid user id and correct password", async () => {
    const res = await request(app)
      .post("/verify-password")
      .send({ userId: testUser._id, password: "testPassword123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("isPasswordCorrect", true);
  });

  it("should return false for a valid user id and incorrect password", async () => {
    const res = await request(app)
      .post("/verify-password")
      .send({ userId: testUser._id, password: "wrongPassword123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("isPasswordCorrect", false);
  });

  it("should return 404 for a non-existent user id", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post("/verify-password")
      .send({ userId: fakeUserId, password: "anyPassword" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found.");
  });

  it("should handle internal server errors gracefully", async () => {
    const res = await request(app)
      .post("/verify-password")
      .send({ userId: "invalidUserId", password: "anyPassword" });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error.");
  });

  // Clean up: remove the test user and stop the server
  afterAll(async () => {
    await Account.deleteOne({ _id: testUser._id });
    await server.close();
    await mongoose.disconnect();
  });
});
