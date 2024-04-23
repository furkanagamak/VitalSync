const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");

describe("POST /verifyOtp OTP verification endpoint testing", () => {
  // Dummy account credentials
  const dummyEmail = "staff@example.com";
  const dummyPassword = "staffPassword123";
  let server;
  let uids;

  // Create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Invalid OTP should be rejected with an error message", async () => {
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });

    const otpRes = await request(app)
      .post("/verifyOtp")
      .send({ email: dummyEmail, otp: "wrongOtp123" })
      .expect(400);

    expect(otpRes.body.message).toEqual("Invalid or expired OTP code.");
  });

  it("Valid OTP should verify successfully", async () => {
    // Generate a test OTP in the database for a known user account
    const testOtp = "123456";
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

    await mongoose.model("Account").updateOne(
      { email: dummyEmail },
      {
        "otp.code": testOtp,
        "otp.expiry": expiryDate,
        "otp.used": false,
      }
    );

    const otpRes = await request(app)
      .post("/verifyOtp")
      .send({ email: dummyEmail, otp: testOtp })
      .expect(200);

    expect(otpRes.body.message).toEqual(
      "OTP code verified successfully. You can now reset your password."
    );
  });

  it("Should handle account not found error", async () => {
    const otpRes = await request(app)
      .post("/verifyOtp")
      .send({ email: "nonexistent@example.com", otp: "123456" })
      .expect(400);

    expect(otpRes.body.message).toEqual("Account not found.");
  });

  // Remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
