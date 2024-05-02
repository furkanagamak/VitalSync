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

const addProcedureData = async () => {
  await testProcedureTemplate1.save();
  await testProcedureTemplate2.save();
};

const deleteProcedureData = async () => {
  await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate1._id });
  await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate2._id });
};

describe("GET /procedureTemplates for getting procedures by id", () => {
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

  it("expected data should be returned", async () => {
    const procRes = await request(app).get(`/procedureTemplates`).send();
    expect(procRes.status).toEqual(200);

    const expectedData = [
      {
        procedureName: "ProcedureName",
        estimatedTime: 60,
        specialNotes: "SpecialNotes",
        description: "Description",
      },
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

    const responseData = procRes.body;
    expect(responseData.length).toEqual(expectedData.length);
    for (let i = 0; i < expectedData.length; i++) {
      const proc1 = responseData[i];
      const proc2 = expectedData[i];
      expect(checkProcedureEqual(proc1, proc2)).toBe(true);
    }
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteProcedureData();
    await server.close();
    await mongoose.disconnect();
  });
});
