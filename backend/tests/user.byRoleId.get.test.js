const request = require("supertest");
const mongoose = require("mongoose");
const { server: app } = require("../server.js");
const Role = require("../models/role");
const Account = require("../models/account");

describe("GET /users/accountsByRole/:roleId", () => {
  let validRoleId;
  let invalidRoleId = "5f0cbbbcd3b9f60000aaaaaa";

  beforeAll(() => {
    server = app.listen(5001);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  // Helper function to create a role and associated account
  async function createTestRoleAndAccount() {
    const role = new Role({
      name: "Test Role",
      description: "A role for testing",
      uniqueIdentifier: "test-role-" + new Date().getTime(),
    });
    const savedRole = await role.save();

    const account = new Account({
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      email: `test-${new Date().getTime()}@example.com`,
      accountType: "staff",
      position: "Developer",
      department: "IT",
      degree: "BSc Computer Science",
      phoneNumber: "1234567890",
      eligibleRoles: [savedRole._id],
    });
    await account.save();

    return savedRole._id.toString();
  }

  // Clean up the database by removing test data
  async function cleanupTestData(roleId) {
    await Account.deleteMany({ eligibleRoles: roleId });
    await Role.findByIdAndDelete(roleId);
  }

  // Set up test data before each test
  beforeEach(async () => {
    validRoleId = await createTestRoleAndAccount();
  });

  // Clean up test data after each test
  afterEach(async () => {
    await cleanupTestData(validRoleId);
  });

  test("should respond with a list of accounts for a valid role ID", async () => {
    const response = await request(app)
      .get(`/users/accountsByRole/${validRoleId}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].eligibleRoles).toContainEqual(
      expect.objectContaining({ _id: validRoleId })
    );
  });

  test("should respond with an empty array when no accounts are associated with the role ID", async () => {
    await cleanupTestData(validRoleId); // Remove associated accounts for this role

    const response = await request(app)
      .get(`/users/accountsByRole/${validRoleId}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(0);
  });

  test("should handle requests for an invalid role ID", async () => {
    const response = await request(app)
      .get(`/users/accountsByRole/${invalidRoleId}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(0);
  });
});
