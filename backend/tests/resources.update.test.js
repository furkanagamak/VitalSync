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

describe("PUT /resources for editing resources", () => {
  // Dummy account credentials
  const dummyStaffEmail = "staff@example.com";
  const dummyStaffPassword = "staffPassword123";
  const dummyAdminEmail = "hospitaladmin@example.com";
  const dummyAdminPassword = "hospitalAdminPassword123";
  const testingEquipmentTemplate = new ResourceTemplate({
    type: "equipment",
    name: "testequipment",
    description: "testDescription",
  });
  const testingEquipment = new ResourceInstance({
    type: "equipment",
    name: "testequipment",
    location: "testingLocation",
    description: "testDescription",
    uniqueIdentifier: "t-123",
  });
  const testingSpaceTemplate = new ResourceTemplate({
    type: "spaces",
    name: "testspaces",
    description: "testDescription",
  });
  const testingSpace = new ResourceInstance({
    type: "spaces",
    name: "testspaces",
    location: "testingLocation",
    description: "testDescription",
    uniqueIdentifier: "t-124",
  });
  const testingRole = new Role({
    uniqueIdentifier: "t-900",
    name: "testrole",
    description: "testDescription",
  });
  let server;
  let uids;

  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();

    await testingRole.save();
    await testingSpaceTemplate.save();
    await testingSpace.save();
    await testingEquipmentTemplate.save();
    await testingEquipment.save();
  });

  it("unauthorized requests should be rejected", async () => {
    // not signing in and attempt to update resource
    const unauthorizedRes = await request(app).put(`/resources`).send({
      name: "testName",
      location: "testLocation",
      description: "testDescription",
      uniqueIdentifier: "AB-023",
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
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        uniqueIdentifier: "testUniqueId",
        location: "testLocation",
        description: "testDescription",
      });
    expect(forbiddenRes.status).toEqual(403);
    expect(forbiddenRes.text).toEqual("Only admins may update resources!");
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
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "",
        uniqueIdentifier: "testUniqueId",
        location: "testLocation",
        description: "testDescription",
      });
    expect(missingNameRes.status).toEqual(400);
    expect(missingNameRes.text).toEqual(
      "Please insert a name for the resource!"
    );

    const missingIDRes = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        uniqueIdentifier: "",
        location: "testLocation",
        description: "testDescription",
      });
    expect(missingIDRes.status).toEqual(400);
    expect(missingIDRes.text).toEqual(
      "Please insert the uniqueIdentifier for the target resource!"
    );

    //provided unique identifier does not exists
    const invalidUIDRes = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        uniqueIdentifier: "qweqwweqewqwq",
        location: "testLocation",
        description: "testDescription",
      });
    expect(invalidUIDRes.status).toEqual(400);
    expect(invalidUIDRes.text).toEqual(
      "There does not exist a resource with the provided uniqueIdentifier!"
    );

    //missing location or description for non roles resource
    const missingLocationRes = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        uniqueIdentifier: "t-123",
        location: "",
        description: "testDescription",
      });
    expect(missingLocationRes.status).toEqual(400);
    expect(missingLocationRes.text).toEqual(
      "For non-roles resources, a location and description must be defined!"
    );

    const missingDescriptionRes = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testName",
        uniqueIdentifier: "t-124",
        location: "room-203",
        description: "",
      });
    expect(missingDescriptionRes.status).toEqual(400);
    expect(missingDescriptionRes.text).toEqual(
      "For non-roles resources, a location and description must be defined!"
    );
  });

  it("update existing resources", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // update existing role
    const roleRes = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testrole",
        uniqueIdentifier: "t-900",
        location: "",
        description: "",
      });
    expect(roleRes.status).toEqual(200);
    expect(roleRes.text).toEqual("The role has been updated!");

    const updatedRole = await Role.findOne({ uniqueIdentifier: "t-900" });
    expect(updatedRole.description).toEqual("");

    //updating resource instance - name does not change
    const equipmentResC = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testEquipment",
        uniqueIdentifier: "t-123",
        location: "modifiedEquipment",
        description: "modifiedEquipment",
      });
    expect(equipmentResC.status).toEqual(200);
    expect(equipmentResC.text).toEqual("The resource has been updated!");

    const updatedResourceC = await ResourceInstance.findOne({
      uniqueIdentifier: "t-123",
    });
    expect(updatedResourceC.name).toEqual("testequipment");
    expect(updatedResourceC.location).toEqual("modifiedEquipment");
    expect(updatedResourceC.description).toEqual("modifiedEquipment");

    //updating resource instance - name does change
    const equipmentRes = await request(app)
      .put(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        name: "testModifySpaces",
        uniqueIdentifier: "t-124",
        location: "modifiedSpaces",
        description: "modifiedSpaces",
      });
    expect(equipmentRes.status).toEqual(200);
    expect(equipmentRes.text).toEqual("The resource has been updated!");

    const updatedResourceTemplate = await ResourceTemplate.findOne({
      name: "testmodifyspaces",
    });
    expect(updatedResourceTemplate).not.toBeNull();
    await ResourceTemplate.deleteOne({ name: "testmodifyspaces" });

    const updatedResource = await ResourceInstance.findOne({
      uniqueIdentifier: "t-124",
    });
    expect(updatedResource.name).toEqual("testmodifyspaces");
    expect(updatedResource.location).toEqual("modifiedSpaces");
    expect(updatedResource.description).toEqual("modifiedSpaces");
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await Role.deleteOne({ uniqueIdentifier: "t-900" });
    await ResourceTemplate.deleteOne({ name: "testequipment" });
    await ResourceTemplate.deleteOne({ name: "testspaces" });
    await ResourceInstance.deleteOne({ uniqueIdentifier: "t-123" });
    await ResourceInstance.deleteOne({ uniqueIdentifier: "t-124" });
    await server.close();
    await mongoose.disconnect();
  });
});
