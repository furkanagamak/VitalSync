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
const ProcedureTemplate = require("../models/procedureTemplate.js");
const Account = require("../models/account.js");

describe("DELETE /resources for deleting resources", () => {
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
  const testingOccupiedEquipment = new ResourceInstance({
    type: "equipment",
    name: "testequipment",
    location: "testingLocation",
    description: "testDescription",
    uniqueIdentifier: "t-111",
    unavailableTimes: [{ start: new Date(), end: new Date() }],
  });
  const testingEquipmentProcedureTemplate = new ResourceTemplate({
    type: "equipment",
    name: "testequipmentprocedure",
    description: "testDescription",
  });
  const testingProcedureEquipment = new ResourceInstance({
    type: "equipment",
    name: "testequipmentprocedure",
    location: "testingLocation",
    description: "testDescription",
    uniqueIdentifier: "t-129",
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
  const testingRepRole = new Role({
    uniqueIdentifier: "t-901",
    name: "testreprole",
    description: "testDescription",
  });
  const testingAssignedRole = new Role({
    uniqueIdentifier: "test_assigned_role",
    name: "test assigned role",
    description: "testDescription",
  });
  const testAccount = new Account({
    firstName: "testFN",
    lastName: "testLN",
    email: "test@test.com",
    accountType: "hospital admin",
    position: "Test position",
    department: "Test Department",
    degree: "Test degree",
    phoneNumber: "1234567890",
    password: "staffPassword123", // Password for staff
    eligibleRoles: [testingAssignedRole._id],
  });
  const testProcedureTemplate = new ProcedureTemplate({
    procedureName: "testName",
    description: "testDescription",
    requiredResources: [
      {
        resource: testingEquipmentProcedureTemplate._id,
        quantity: 1,
      },
    ],
    roles: [
      {
        role: testingRepRole._id,
        quantity: 1,
      },
    ],
    estimatedTime: 500,
    specialNotes: "",
  });
  let server;
  let uids;

  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();

    await testingRole.save();
    await testingAssignedRole.save();
    await testingSpaceTemplate.save();
    await testingSpace.save();
    await testingEquipmentTemplate.save();
    await testingEquipment.save();
    await testingOccupiedEquipment.save();
    await testAccount.save();
    await testingEquipmentProcedureTemplate.save();
    await testingProcedureEquipment.save();
    await testProcedureTemplate.save();
    await testingRepRole.save();
  });

  it("unauthorized requests should be rejected", async () => {
    // not signing in and attempt to update resource
    const unauthorizedRes = await request(app).delete(`/resources`).send({
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
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "testUniqueId",
      });
    expect(forbiddenRes.status).toEqual(403);
    expect(forbiddenRes.text).toEqual("Only admins may delete resources!");
  });

  it("invalid inputs", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // missing uniqueIdentifier checks
    const missingUIDRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "",
      });
    expect(missingUIDRes.status).toEqual(400);
    expect(missingUIDRes.text).toEqual(
      "Please insert the uniqueIdentifier of the resource that you are trying to delete!"
    );

    //provided unique identifier does not exists
    const invalidUIDRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "qweqwweqewqwq",
      });
    expect(invalidUIDRes.status).toEqual(400);
    expect(invalidUIDRes.text).toEqual(
      "There does not exists an resource with the provided uniqueIdentifier!"
    );

    // delete existing equipment that is occupied
    const spacesRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "t-111",
      });
    expect(spacesRes.status).toEqual(409);
    expect(spacesRes.text).toEqual(
      "The resource you are trying to delete is occupied to one or more process instance!"
    );

    // delete existing role that is assigned to someone
    const roleRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "test_assigned_role",
      });
    expect(roleRes.status).toEqual(409);
    expect(roleRes.text).toEqual(
      "The role you are trying to delete is assigned to one or more accounts!"
    );
    expect(
      await Role.findOne({ uniqueIdentifier: "test_assigned_role" })
    ).not.toBeNull();

    // delete existing role that is assigned to a procedure template
    const roleRepRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "t-901",
      });
    expect(roleRepRes.status).toEqual(409);
    expect(roleRepRes.text).toEqual(
      "The role you are trying to delete is assigned to one or more procedure templates!"
    );
    expect(await Role.findOne({ uniqueIdentifier: "t-901" })).not.toBeNull();

    // resources assigned to procedure templates cannot be deleted
    const equipmentRepRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "t-129",
      });
    expect(equipmentRepRes.status).toEqual(409);
    expect(equipmentRepRes.text).toEqual(
      "The resource you are trying to delete is assigned to one or more procedure templates!"
    );
    expect(
      await ResourceTemplate.findOne({
        name: "testequipmentprocedure",
      })
    ).not.toBeNull();
    expect(
      await ResourceInstance.findOne({
        uniqueIdentifier: "t-129",
      })
    ).not.toBeNull();
  });

  it("deleting existing resources", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // delete existing role
    const roleRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "t-900",
      });
    expect(roleRes.status).toEqual(200);
    expect(roleRes.text).toEqual("The role has been deleted!");

    const findDeletedRole = await Role.findOne({ uniqueIdentifier: "t-900" });
    expect(findDeletedRole).toBeNull();

    // delete existing equipment
    const equipmentRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "t-123",
      });
    expect(equipmentRes.status).toEqual(200);
    expect(equipmentRes.text).toEqual("The resource has been deleted!");

    const findDeletedEquipment = await ResourceInstance.findOne({
      uniqueIdentifier: "t-123",
    });
    expect(findDeletedEquipment).toBeNull();

    // same equipment template should not be deleted when another resource with the same template is present
    const findDeletedEquipmentTemplate = await ResourceTemplate.findOne({
      name: "testequipment",
    });
    expect(findDeletedEquipmentTemplate).not.toBeNull();

    expect(
      await ResourceTemplate.findOne({
        name: "testequipmentprocedure",
      })
    ).not.toBeNull();

    // delete existing spaces
    const spacesRes = await request(app)
      .delete(`/resources`)
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`])
      .send({
        uniqueIdentifier: "t-124",
      });
    expect(spacesRes.status).toEqual(200);
    expect(spacesRes.text).toEqual("The resource has been deleted!");

    const findDeletedSpace = await ResourceInstance.findOne({
      uniqueIdentifier: "t-124",
    });
    expect(findDeletedSpace).toBeNull();
    const findDeletedSpaceTemplate = await ResourceTemplate.findOne({
      name: "testspaces",
    });
    expect(findDeletedSpace).toBeNull();
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await ResourceInstance.deleteOne({ uniqueIdentifier: "t-111" });
    await ResourceInstance.deleteOne({ uniqueIdentifier: "t-123" });
    await ResourceInstance.deleteOne({ uniqueIdentifier: "t-124" });
    await ResourceInstance.deleteOne({ uniqueIdentifier: "t-129" });
    await ResourceTemplate.deleteOne({ name: "testequipment" });
    await ResourceTemplate.deleteOne({ name: "testspaces" });
    await ResourceTemplate.deleteOne({ name: "testequipmentprocedure" });
    await Account.deleteOne({ email: "test@test.com" });
    await Role.deleteOne({ uniqueIdentifier: "test_assigned_role" });
    await Role.deleteOne({ uniqueIdentifier: "t-900" });
    await Role.deleteOne({ uniqueIdentifier: "t-901" });
    await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate._id });
    await server.close();
    await mongoose.disconnect();
  });
});
