const request = require("supertest");
const { app } = require("../server.js");
const mongoose = require("mongoose");
const Role = require("../models/role.js");
const ResourceTemplate = require("../models/resourceTemplate.js");
const ProcedureTemplate = require("../models/procedureTemplate.js");

describe("POST /procedureTemplates", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(5001);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should create a procedure template successfully", async () => {
    const role = await new Role({ name: "Experienced Brain Surgeon", uniqueIdentifier: "EBS-01" }).save();
    const resource = await new ResourceTemplate({ type: "Medical", name: "Scalpel" }).save();

    const newTemplate = {
      procedureName: "Appendectomy",
      description: "Appendix removal",
      requiredResources: [{ resourceName: "Scalpel", quantity: 1 }],
      roles: [{ roleName: "Experienced Brain Surgeon", quantity: 2 }],
      estimatedTime: 120,
      specialNotes: "Patient must be fasting for 12 hours prior."
    };

    const response = await request(server)
      .post("/procedureTemplates")
      .send(newTemplate)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.procedureName).toEqual("Appendectomy");
  });

  it("should return an error if a required resource is not found", async () => {
    const newTemplate = {
      procedureName: "Hip Replacement",
      description: "Hip joint replacement",
      requiredResources: [{ resourceName: "Hip Implant", quantity: 1 }],
      roles: [{ roleName: "Orthopedic Surgeon", quantity: 1 }],
      estimatedTime: 240,
      specialNotes: ""
    };

    const response = await request(server)
      .post("/procedureTemplates")
      .send(newTemplate)
      .expect(400);

    expect(response.body.error).toEqual("Resource not found: Hip Implant");
  });

  it("should return an error if a required role is not found", async () => {
    const newTemplate = {
      procedureName: "Knee Surgery",
      description: "Knee ligament repair",
      requiredResources: [],
      roles: [{ roleName: "Knee Surgeon", quantity: 1 }],
      estimatedTime: 180,
      specialNotes: "Check patient's reaction to anesthesia."
    };

    const response = await request(server)
      .post("/procedureTemplates")
      .send(newTemplate)
      .expect(400);

    expect(response.body.error).toEqual("Role not found: Knee Surgeon");
  });
});
