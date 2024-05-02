const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");
const Role = require("../models/role.js");

const testRole1 = new Role({
  name: "my test role 1",
  description: "my test role 1 description",
  uniqueIdentifier: "my_test_role_1",
});

const testRole2 = new Role({
  name: "my test role 2",
  description: "my test role 2 description",
  uniqueIdentifier: "my_test_role_2",
});

const testRole3 = new Role({
  name: "my test role 3",
  description: "my test role 3 description",
  uniqueIdentifier: "my_test_role_3",
});

const addData = async () => {
  await testRole1.save();
  await testRole2.save();
  await testRole3.save();
};

const deleteData = async () => {
  await Role.deleteOne({ _id: testRole1._id });
  await Role.deleteOne({ _id: testRole2._id });
  await Role.deleteOne({ _id: testRole3._id });
};

describe("GET /roles for creating resources", () => {
  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
    await addData();
  });

  const checkRoleEqual = (role1, role2) => {
    if (role1.uniqueIdentifier !== role2.uniqueIdentifier) return false;
    if (role1.name !== role2.name) return false;
    if (role1.description !== role2.description) return false;
    return true;
  };

  it("getting expected roles", async () => {
    const roleRes = await request(app).get(`/roles`).send();
    expect(roleRes.status).toEqual(200);

    const existingRole1 = await Role.findOne({
      name: "physician",
    });
    const existingRole2 = await Role.findOne({
      name: "nurse",
    });
    const existingRole3 = await Role.findOne({
      name: "surgeon",
    });
    const existingRole4 = await Role.findOne({
      name: "Name",
    });
    if (!existingRole1 || !existingRole2 || !existingRole3 || !existingRole4)
      throw new Error("Please run dbtest.js script first!");

    const responseData = roleRes.body;
    const expectedData = [
      {
        name: "Name",
        description: "Description",
        uniqueIdentifier: "UniqueIdentifier",
      },
      {
        name: "physician",
        description: "",
        uniqueIdentifier: "physician",
      },
      {
        name: "nurse",
        description: "",
        uniqueIdentifier: "nurse",
      },
      {
        name: "surgeon",
        description: "",
        uniqueIdentifier: "surgeon",
      },
      {
        name: "my test role 1",
        description: "my test role 1 description",
        uniqueIdentifier: "my_test_role_1",
      },
      {
        name: "my test role 2",
        description: "my test role 2 description",
        uniqueIdentifier: "my_test_role_2",
      },
      {
        name: "my test role 3",
        description: "my test role 3 description",
        uniqueIdentifier: "my_test_role_3",
      },
    ];

    expect(responseData.length).toEqual(expectedData.length);
    for (let i = 0; i < expectedData.length; i++) {
      const role1 = responseData[i];
      const role2 = expectedData[i];
      console.log("comparing roles:");
      console.log(role1);
      console.log(role2);
      expect(checkRoleEqual(role1, role2)).toBe(true);
    }
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteData();
    await server.close();
    await mongoose.disconnect();
  });
});
