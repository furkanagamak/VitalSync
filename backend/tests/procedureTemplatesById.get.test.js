const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");
const ProcedureTemplate = require("../models/procedureTemplate.js");

const testProcedureTemplate1 = new ProcedureTemplate({
  procedureName: "Test Procedure 1",
  requiredResources: [],
  roles: [],
  estimatedTime: 60,
});

const testProcedureTemplate2 = new ProcedureTemplate({
  procedureName: "Test Procedure 2",
  requiredResources: [],
  roles: [],
  estimatedTime: 120,
});

const testProcedureTemplateNotAdded = new ProcedureTemplate({
  procedureName: "Test Procedure NotAdded",
  requiredResources: [],
  roles: [],
  estimatedTime: 120,
});

const addProcedureData = async () => {
  await testProcedureTemplate1.save();
  await testProcedureTemplate2.save();
};

const deleteProcedureData = async () => {
  await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate1._id });
  await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate2._id });
};

describe("GET /procedureTemplates/:id for getting procedures by id", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
    await addProcedureData();
  });

  const checkProcedureEqual = (proc1, proc2) => {
    if (proc1.procedureName !== proc2.procedureName) return false;
    if (proc1.estimatedTime !== proc2.estimatedTime) return false;
    if (proc1.description !== proc2.description) return false;
    if (proc1.specialNotes !== proc2.specialNotes) return false;
    return true;
  };

  it("GET /procedureTemplates/:id bad inputs", async () => {
    const malformedIdRes = await request(app)
      .get(`/procedureTemplates/123`)
      .send();
    console.log(malformedIdRes.body);
    expect(malformedIdRes.status).toEqual(500);
    expect(malformedIdRes.body.message).toEqual(
      "Error fetching procedure template"
    );

    const dneIdRes = await request(app)
      .get(
        `/procedureTemplates/${testProcedureTemplateNotAdded._id.toString()}`
      )
      .send();
    expect(dneIdRes.status).toEqual(404);
    expect(dneIdRes.body.message).toEqual("Procedure template not found");
  });

  it("GET /procedureTemplates/:id usual get by id", async () => {
    const procRes1 = await request(app)
      .get(`/procedureTemplates/${testProcedureTemplate1._id.toString()}`)
      .send();
    expect(procRes1.status).toEqual(200);

    const procRes2 = await request(app)
      .get(`/procedureTemplates/${testProcedureTemplate2._id.toString()}`)
      .send();
    expect(procRes2.status).toEqual(200);

    const expectedData = [
      {
        procedureName: "Test Procedure 1",
        estimatedTime: 60,
        specialNotes: "",
        description: "",
      },
      {
        procedureName: "Test Procedure 2",
        estimatedTime: 120,
        specialNotes: "",
        description: "",
      },
    ];

    const responseData1 = procRes1.body;
    expect(checkProcedureEqual(responseData1, expectedData[0]));

    const responseData2 = procRes2.body;
    expect(checkProcedureEqual(responseData2, expectedData[1]));
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteProcedureData();
    await server.close();
    await mongoose.disconnect();
  });
});
