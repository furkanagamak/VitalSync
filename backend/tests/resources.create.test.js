const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");
const Role = require("../models/role.js");
const ResourceInstance = require("../models/resourceInstance.js");
const ResourceTemplate = require("../models/resourceTemplate.js");

describe("POST /resources for creating resources", () => {
  // Dummy account credentials
  const dummyStaffEmail = "staff@example.com";
  const dummyStaffPassword = "staffPassword123";
  const dummyAdminEmail = "hospitaladmin@example.com";
  const dummyAdminPassword = "hospitalAdminPassword123";
  let server;
  let uids;

  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  it("unauthorized requests should be rejected", async () => {
    // not signing in and attempt to create resource
    const unauthorizedRes = await request(app).post(`/resources`).send({
      name: "testName",
      type: "testType",
      location: "testLocation",
      description: "testDescription",
    });
    expect(unauthorizedRes.status).toEqual(401);
    expect(unauthorizedRes.text).toEqual("User not logged in");

    // sign in with staff account should not be accepted
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyStaffEmail,
      password: dummyStaffPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    const forbiddenRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        type: "testType",
        location: "testLocation",
        description: "testDescription",
      });
    expect(forbiddenRes.status).toEqual(403);
    expect(forbiddenRes.text).toEqual("Only admins may create resources!");
  });

  it("invalid inputs", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // missing name or type checks
    const missingNameRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "",
        type: "testType",
        location: "testLocation",
        description: "testDescription",
      });
    expect(missingNameRes.status).toEqual(400);
    expect(missingNameRes.text).toEqual(
      "Please insert a name and type for the resource!"
    );

    const typeRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        type: "",
        location: "testLocation",
        description: "testDescription",
      });
    expect(typeRes.status).toEqual(400);
    expect(typeRes.text).toEqual(
      "Please insert a name and type for the resource!"
    );

    //invalid resource type provided
    const invalidRoleRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        type: "testType",
        location: "testLocation",
        description: "testDescription",
      });
    expect(invalidRoleRes.status).toEqual(400);
    expect(invalidRoleRes.text).toEqual(
      "Type can only be equipment, spaces, or roles!"
    );

    //missing location or description for non roles resource
    const missingLocationRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        type: "equipment",
        location: "",
        description: "testDescription",
      });
    expect(missingLocationRes.status).toEqual(400);
    expect(missingLocationRes.text).toEqual(
      "For non-roles resources, a location and description must be defined!"
    );

    const missingDescriptionRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        type: "equipment",
        location: "room-203",
        description: "",
      });
    expect(missingDescriptionRes.status).toEqual(400);
    expect(missingDescriptionRes.text).toEqual(
      "For non-roles resources, a location and description must be defined!"
    );

    const duplicateRolesRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "physician",
        type: "roles",
        location: "",
        description: "",
      });
    expect(duplicateRolesRes.status).toEqual(400);
    expect(duplicateRolesRes.text).toEqual(
      "A role with the requested name already exists!"
    );
  });

  it("Create new role", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // missing name or type checks
    const roleRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "test role",
        type: "roles",
        location: "",
        description: "",
      });
    expect(roleRes.status).toEqual(201);
    expect(roleRes.text).toEqual("The newly requested role is created!");

    const createdRole = await Role.findOne({ name: "test role" });
    expect(createdRole).toBeDefined();
    expect(createdRole.name).toEqual("test role");

    await Role.deleteOne({ name: "test role" });
  });

  it("Create new equipment", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    // // missing name or type checks
    const equipRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "test equipment",
        type: "equipment",
        location: "test location",
        description: "test description",
      });
    expect(equipRes.status).toEqual(201);
    expect(equipRes.text).toEqual(
      "The resource has been successfully created!"
    );
    const createdEquip = await ResourceInstance.findOne({
      name: "test equipment",
    });
    expect(createdEquip).toBeDefined();
    expect(createdEquip.name).toEqual("test equipment");
    expect(createdEquip.location).toEqual("test location");
    expect(createdEquip.description).toEqual("test description");

    const createEquipTemplate = await ResourceTemplate.findOne({
      name: "test equipment",
    });
    expect(createEquipTemplate).toBeDefined();
    expect(createEquipTemplate.name).toEqual("test equipment");
    expect(createEquipTemplate.description).toEqual("test description");

    await ResourceInstance.deleteOne({ name: "test equipment" });
    await ResourceTemplate.deleteOne({ name: "test equipment" });
  });

  it("Create new spaces", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    // // missing name or type checks
    const spacesRes = await request(app)
      .post(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "Test Spaces",
        type: "spaces",
        location: "test location",
        description: "test description",
      });
    expect(spacesRes.status).toEqual(201);
    expect(spacesRes.text).toEqual(
      "The resource has been successfully created!"
    );
    const createdSpaces = await ResourceInstance.findOne({
      name: "test spaces",
    });
    expect(createdSpaces).toBeDefined();
    expect(createdSpaces.name).toEqual("test spaces");
    expect(createdSpaces.location).toEqual("test location");
    expect(createdSpaces.description).toEqual("test description");

    const createSpacesTemplate = await ResourceTemplate.findOne({
      name: "test spaces",
    });
    expect(createSpacesTemplate).toBeDefined();
    expect(createSpacesTemplate.name).toEqual("test spaces");
    expect(createSpacesTemplate.description).toEqual("test description");

    await ResourceInstance.deleteOne({ name: "test spaces" });
    await ResourceTemplate.deleteOne({ name: "test spaces" });
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await server.close();
    await mongoose.disconnect();
  });
});
