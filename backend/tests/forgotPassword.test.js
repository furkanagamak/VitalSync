const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const Account = require("../models/account");

describe("POST /forgotPassword password reset endpoint testing", () => {
  let server;
  let dummyEmail = "staff@example.com";
  let dummyEmailNonExistent = "noone@example.com";

  // Set up dummy accounts
  beforeAll(async () => {
    server = app.listen(5002);
    await initializePredefinedAccounts();
  });

  it("Should return an error if the account does not exist", async () => {
    const res = await request(app)
      .post("/forgotPassword")
      .send({ email: dummyEmailNonExistent });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Account not found.");
  });

  it("Should send an OTP if the account exists", async () => {
    const res = await request(app)
      .post("/forgotPassword")
      .send({ email: dummyEmail });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("OTP sent to your email.");

    const updatedAccount = await Account.findOne({ email: dummyEmail });
    expect(updatedAccount.otp.code).not.toBeNull();
    expect(updatedAccount.otp.expiry).not.toBeNull();
    expect(updatedAccount.otp.used).toBe(false);
  });

  // Clean up dummy accounts and close the server
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
