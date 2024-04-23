const { server: app } = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const ProcedureTemplate = require("../models/procedureTemplate.js");
const ResourceTemplate = require("../models/resourceTemplate.js");
const Role = require("../models/role.js");

describe("POST /procedureTemplates for creating procedure templates", () => {
  let server;
  let createdResourceIds = [];
  let createdRoleIds = [];
  let createdProcedureTemplateIds = [];

  const resources = [
    { type: "Equipment", name: "X-Ray Machine" },
    { type: "Medicine", name: "Aspirin" },
  ];

  const roles = [
    { name: "Surgeons", uniqueIdentifier: "surgeons-001" },
    { name: "Nurses", uniqueIdentifier: "nurses-001" },
  ];

  beforeAll(async () => {
    server = app.listen(5001);

    const insertedResources = await ResourceTemplate.insertMany(resources);
    const insertedRoles = await Role.insertMany(roles);
    createdResourceIds = insertedResources.map((item) => item._id);
    createdRoleIds = insertedRoles.map((item) => item._id);
  });

  afterAll(async () => {
    await ProcedureTemplate.deleteMany({
      _id: { $in: createdProcedureTemplateIds },
    });
    await ResourceTemplate.deleteMany({ _id: { $in: createdResourceIds } });
    await Role.deleteMany({ _id: { $in: createdRoleIds } });
    await server.close();
    await mongoose.disconnect();
  });

  test("should create a new procedure template", async () => {
    const resourceTemplates = await ResourceTemplate.find({});
    const roles = await Role.find({});

    const procedureData = {
      procedureName: "Appendectomy",
      description: "Appendix removal surgery",
      requiredResources: resourceTemplates.map((r) => ({
        resourceName: r.name,
        quantity: 1,
      })),
      roles: roles.map((r) => ({ roleName: r.name, quantity: 2 })),
      estimatedTime: 120,
      specialNotes: "Requires anesthesia.",
    };

    const response = await request(server)
      .post("/procedureTemplates")
      .send(procedureData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "procedureName",
      procedureData.procedureName
    );
    expect(response.body.requiredResources).toHaveLength(
      procedureData.requiredResources.length
    );
    expect(response.body.roles).toHaveLength(procedureData.roles.length);

    createdProcedureTemplateIds.push(response.body._id);
  });

  test("should handle errors when missing required fields", async () => {
    const procedureData = {
      description: "No procedure name provided",
    };

    const response = await request(server)
      .post("/procedureTemplates")
      .send(procedureData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Failed to create procedure template"
    );
  });
});
