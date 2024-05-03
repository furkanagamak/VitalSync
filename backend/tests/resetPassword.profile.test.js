const request = require("supertest");
const mongoose = require("mongoose");
const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const Account = require("../models/account.js");

describe("POST /reset-password", () => {
  let server;
  let uids;

  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Should return an error when the newPassword is empty", async () => {
    const res = await request(app).post("/reset-password").send({
      userId: uids[0],
      newPassword: "",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Password cannot be empty.");
  });

  it("Should return an error when user is not found", async () => {
    const res = await request(app).post("/reset-password").send({
      userId: new mongoose.Types.ObjectId(),
      newPassword: "newPassword123",
    });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User not found.");
  });

  it("Should successfully update the password for a valid user", async () => {
    const res = await request(app).post("/reset-password").send({
      userId: uids[0],
      newPassword: "newPassword123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Password successfully updated.");
  });

  it("Should hash the new password, not storing it in plain text", async () => {
    const newPassword = "newPassword1234";
    const res = await request(app).post("/reset-password").send({
      userId: uids[0],
      newPassword,
    });
    const user = await Account.findById(uids[0]);
    expect(user.password).not.toBe(newPassword);
    expect(user.password.length).toBeGreaterThan(10);
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
