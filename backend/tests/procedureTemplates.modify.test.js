const { server: app } = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const ProcedureTemplate = require("../models/procedureTemplate.js");
const ResourceTemplate = require("../models/resourceTemplate.js");
const Role = require("../models/role.js");

describe("PUT /procedureTemplates/:id for modifying procedure templates", () => {
  let server;
  let createdResourceIds = [];
  let createdRoleIds = [];
  let createdProcedureTemplateIds = [];

  beforeAll(async () => {
    server = app.listen(5001);

    const resources = [
      { type: "Equipment", name: "X-Ray Machine" },
      { type: "Medicine", name: "Ibuprofen" },
    ];

    const roles = [
      { name: "Anesthesiologists", uniqueIdentifier: "anes-001" },
      { name: "Assistants", uniqueIdentifier: "assist-001" },
    ];

    const insertedResources = await ResourceTemplate.insertMany(resources);
    const insertedRoles = await Role.insertMany(roles);

    createdResourceIds = insertedResources.map((item) => item._id);
    createdRoleIds = insertedRoles.map((item) => item._id);

    const procedureTemplate = new ProcedureTemplate({
      procedureName: "Knee Replacement",
      description: "Surgical replacement of knee",
      requiredResources: insertedResources.map((res) => ({
        resource: res._id,
        quantity: 1,
      })),
      roles: insertedRoles.map((role) => ({ role: role._id, quantity: 1 })),
      estimatedTime: 180,
      specialNotes: "Patient must be fasting for 12 hours.",
    });
    const savedProcedureTemplate = await procedureTemplate.save();
    createdProcedureTemplateIds.push(savedProcedureTemplate._id);
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

  test("should modify an existing procedure template", async () => {
    const procedureTemplateId = createdProcedureTemplateIds[0];
    const updatedData = {
      procedureName: "Updated Knee Replacement",
      description: "Updated description",
      requiredResources: [
        { resourceName: "Ibuprofen", quantity: 2 },
        { resourceName: "X-Ray Machine", quantity: 1 },
      ],
      roles: [
        { roleName: "Anesthesiologists", quantity: 2 },
        { roleName: "Assistants", quantity: 2 },
      ],
      estimatedTime: 200,
      specialNotes: "Ensure patient is not allergic to medication.",
    };

    const response = await request(server)
      .put(`/procedureTemplates/${procedureTemplateId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "procedureName",
      updatedData.procedureName
    );
    expect(response.body.requiredResources).toHaveLength(
      updatedData.requiredResources.length
    );
    expect(response.body.roles).toHaveLength(updatedData.roles.length);
  });

  test("should handle errors when the procedure template does not exist", async () => {
    const response = await request(server)
      .put("/procedureTemplates/invalidId")
      .send({
        procedureName: "Nonexistent Procedure",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Failed to update procedure template"
    );
  });
});
