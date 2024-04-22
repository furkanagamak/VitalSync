const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");
const Account = require("../models/account.js");

describe("GET /user/profilePicture/url/:id get signed profile picture url", () => {
  // Dummy account credentials
  const dummyEmail = "systemadmin@example.com";
  const dummyPassword = "systemAdminPassword123";
  let server;
  let uids;

  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("Attempt to create account with existing emails", async () => {
    // Log in with dummy account to get a valid session
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });
    // Extract accountId from the response cookies
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    const response = await request(app)
      .post("/createAccount")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "staff@example.com", // Use an existing email
        accountType: "admin",
        position: "Manager",
        department: "HR",
        degree: "MBA",
        phoneNumber: "1234567890",
        eligibleRoles: "physician",
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe("An account with this email already exists.");
  });

  it("Attempt to create account with missing required fields", async () => {
    // Log in with dummy account to get a valid session
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });
    // Extract accountId from the response cookies
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // account type field is missing here
    const response = await request(app)
      .post("/createAccount")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "staff@example.com",
        position: "Manager",
        department: "HR",
        degree: "MBA",
        phoneNumber: "1234567890",
        eligibleRoles: "physician",
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "All fields except officePhoneNumber and officeLocation are required."
    );
  });

  it("Attempt to create account with invalid role", async () => {
    // Log in with dummy account to get a valid session
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });
    // Extract accountId from the response cookies
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    const response = await request(app)
      .post("/createAccount")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        accountType: "admin",
        position: "Manager",
        department: "HR",
        degree: "MBA",
        phoneNumber: "1234567890",
        eligibleRoles: "manager",
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe("queried role doesn't exists");
  });

  it("Attempt to create account with valid fields", async () => {
    // Log in with dummy account to get a valid session
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });
    // Extract accountId from the response cookies
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    const response = await request(app)
      .post("/createAccount")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        accountType: "hospital admin",
        position: "head of department",
        department: "Heart Department",
        degree: "bachelors",
        phoneNumber: "1234567890",
        eligibleRoles: "physician",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Account created successfully");
    expect(response.body.accountId).toBeDefined();

    const userEmail = "john@example.com";
    await Account.findOneAndDelete({ email: userEmail });
    const deletedUser = await Account.findOne({ email: userEmail });
    expect(deletedUser).toBeNull();
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
