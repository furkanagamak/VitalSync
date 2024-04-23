const { server: app } = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const ProcedureTemplate = require("../models/procedureTemplate.js");
const SectionTemplate = require("../models/sectionTemplate.js");

describe("DELETE /procedureTemplates/:id for deleting procedure templates", () => {
  let server;
  let createdResourceIds = [];
  let createdRoleIds = [];
  let createdProcedureTemplateIds = [];

  beforeAll(async () => {
    server = app.listen(5001);
  });

  afterAll(async () => {
    await ProcedureTemplate.deleteMany({
      _id: { $in: createdProcedureTemplateIds },
    });
    await server.close();
    await mongoose.disconnect();
  });

  test("should delete a procedure template not in use", async () => {
    const newProcedureTemplate = await ProcedureTemplate.create({
      procedureName: "Surgical Procedure",
      description: "Standard surgical procedure",
      requiredResources: [],
      roles: [],
      estimatedTime: 90,
      specialNotes: "None",
    });
    createdProcedureTemplateIds.push(newProcedureTemplate._id);

    const response = await request(server)
      .delete(`/procedureTemplates/${newProcedureTemplate._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Procedure template deleted successfully."
    );
  });

  test("should delete a procedure template if it is in use by a section template but not process template", async () => {
    const procedureTemplateInUse = await ProcedureTemplate.create({
      procedureName: "Complex Procedure",
      description: "Procedure requiring multiple sections",
      requiredResources: [],
      roles: [],
      estimatedTime: 120,
      specialNotes: "Extensive preparation required",
    });
    createdProcedureTemplateIds.push(procedureTemplateInUse._id);

    const sectionUsingTemplate = await SectionTemplate.create({
      sectionName: "Section A",
      description: "Section using the procedure",
      procedureTemplates: [procedureTemplateInUse._id],
    });

    const response = await request(server)
      .delete(`/procedureTemplates/${procedureTemplateInUse._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Procedure template deleted successfully."
    );

    await SectionTemplate.deleteOne({ _id: sectionUsingTemplate._id });
  });
});
