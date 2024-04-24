const request = require("supertest");
const { server: app } = require("../server.js");
const mongoose = require("mongoose");
const ProcessTemplate = require("../models/processTemplate.js");
const SectionTemplate = require("../models/sectionTemplate.js");
const SectionInstance = require("../models/sectionTemplate.js");
const Role = require("../models/role.js");
const ResourceTemplate = require("../models/resourceTemplate.js");
const ProcedureTemplate = require("../models/procedureTemplate.js");

describe("POST /processTemplates", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(5001);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should create a process template successfully with predefined procedures", async () => {
    // Create necessary roles and resources first
    const role = await new Role({
      name: "Neurosurgeon",
      uniqueIdentifier: "NES-02",
    }).save();
    const resource = await new ResourceTemplate({
      type: "Equipment",
      name: "Scalpel Kit",
    }).save();

    // Create procedure template
    const procedureData = {
      procedureName: "Craniotomy",
      description: "Brain surgery",
      requiredResources: [{ resource: resource._id, quantity: 1 }],
      roles: [{ role: role._id, quantity: 2 }],
      estimatedTime: 300,
      specialNotes: "Patient must be fasting for 12 hours prior.",
    };

    const procedure = await new ProcedureTemplate(procedureData);
    await procedure.save();

    // Sections referencing the procedure template
    const sections = [
      {
        sectionName: "Pre-Op",
        description: "Pre-operative procedures",
        procedureTemplates: [procedure._id],
      },
      {
        sectionName: "Surgery",
        description: "Surgical procedures",
        procedureTemplates: [procedure._id],
      },
    ];

    const newTemplate = {
      processName: "Craniotomy Brain Surgery",
      description: "A type of brain surgery",
      sections: sections,
    };

    const response = await request(server)
      .post("/processTemplates")
      .send(newTemplate)
      .expect(201);
    console.log(response.body);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.processName).toEqual("Craniotomy Brain Surgery");
    expect(response.body.sectionTemplates).toHaveLength(2);

    await Role.deleteOne({ _id: role._id });
    await ResourceTemplate.deleteOne({ _id: resource._id });
    await SectionTemplate.deleteOne({ sectionName: "Pre-Op" });
    await SectionTemplate.deleteOne({ sectionName: "Surgery" });
    await ProcedureTemplate.deleteOne({ _id: procedure._id });
    await ProcessTemplate.deleteOne({
      processName: newTemplate.processName,
    });
  });
});
