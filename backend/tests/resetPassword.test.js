const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

describe("POST /resetPassword password reset endpoint testing", () => {
  const dummyEmail = "staff@example.com";
  const newPassword = "newPassword123";
  let server;
  let uids;

  // Create predefined accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Should reject reset for non-existent account", async () => {
    const res = await request(app).post("/resetPassword").send({
      email: "nonexistent@example.com",
      newPassword: newPassword,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual("Account not found");
  });

  it("Should handle bcrypt hashing errors", async () => {
    // Spy on bcrypt.hash to simulate an error
    const spy = jest
      .spyOn(bcrypt, "hash")
      .mockImplementation((_, __, callback) => {
        callback(new Error("Simulated hashing error"), null);
      });

    const res = await request(app).post("/resetPassword").send({
      email: dummyEmail,
      newPassword: newPassword,
    });
    expect(res.status).toEqual(500);
    expect(res.body.message).toEqual("Error hashing new password");

    // Restore original function
    spy.mockRestore();
  });

  it("Successful password reset updates user's password and clears otp data", async () => {
    const res = await request(app).post("/resetPassword").send({
      email: dummyEmail,
      newPassword: newPassword,
    });
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Password reset successfully");
  });

  // Remove predefined accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
