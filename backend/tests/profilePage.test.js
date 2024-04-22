const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");

describe("Profile Page endpoint testing", () => {
  const dummyEmail = "staff@example.com";
  const newPassword = "newPassword123";
  let server;
  let uids;

  // Create predefined accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  describe("GET /user/:userId", () => {
    it("should retrieve a user if the user exists", async () => {
      const userId = uids[0];
      const res = await request(server).get(`/user/${userId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("userId", userId.toString());
      expect(res.body).toHaveProperty("firstName");
      expect(res.body).toHaveProperty("lastName");
    });

    it("should return a 404 if the user does not exist", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId().toString();
      const res = await request(server).get(`/user/${nonExistentUserId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: "User not found" });
    });
  });

  describe("PUT /user/:userId", () => {
    it("should update a user if the user exists and data is valid", async () => {
      const userId = uids[0]; // using the first user ID
      const updatedData = {
        firstName: "UpdatedName",
        lastName: "UpdatedLastName",
      };
      const res = await request(server)
        .put(`/user/${userId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "message",
        "Profile updated successfully"
      );
      expect(res.body.user).toHaveProperty("firstName", "UpdatedName");
    });

    it("should return a 404 if the user does not exist", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId().toString();
      const res = await request(server).get(`/user/${nonExistentUserId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    afterAll(async () => {
      await removePredefinedAccounts();
      await new Promise((resolve) => server.close(resolve));
      await mongoose.disconnect();
    });
  });
});
