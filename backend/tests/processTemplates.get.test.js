const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const ProcessTemplate = require("../models/processTemplate.js");
const SectionTemplate = require("../models/sectionTemplate.js");
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

const testSectionTemplate1 = new SectionTemplate({
  sectionName: "Test Section 1",
  description: "Description 1",
  procedureTemplates: [testProcedureTemplate1._id],
});

const testSectionTemplate2 = new SectionTemplate({
  sectionName: "Test Section 2",
  description: "Description 2",
  procedureTemplates: [testProcedureTemplate2._id],
});

const addSectionData = async () => {
  await testSectionTemplate1.save();
  await testSectionTemplate2.save();
};

const deleteSectionData = async () => {
  await SectionTemplate.deleteOne({ _id: testSectionTemplate1._id });
  await SectionTemplate.deleteOne({ _id: testSectionTemplate2._id });
};

const testProcessTemplate1 = new ProcessTemplate({
  processName: "Test Process 1",
  description: "Description 1",
  sectionTemplates: [testSectionTemplate1._id, testSectionTemplate2._id],
});

const addProcessData = async () => {
  await testProcessTemplate1.save();
};

const deleteProcessData = async () => {
  await ProcessTemplate.deleteOne({ _id: testProcessTemplate1._id });
};

describe("GET /processTemplates for editing processes", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
    await addProcedureData();
    await addSectionData();
    await addProcessData();
  });

  const checkProcessTemplateEqual = (proc1, proc2) => {
    if (proc1.processName !== proc2.processName) {
      console.log(
        `Process names do not match: ${proc1.processName} !== ${proc2.processName}`
      );
      return false;
    }
    if (proc1.description !== proc2.description) {
      console.log(
        `Descriptions do not match: ${proc1.description} !== ${proc2.description}`
      );
      return false;
    }
    if (proc1.sectionTemplates.length !== proc2.sectionTemplates.length) {
      console.log(
        `Section template lengths do not match: ${proc1.sectionTemplates.length} !== ${proc2.sectionTemplates.length}`
      );
      return false;
    }
    for (let i = 0; i < proc1.sectionTemplates.length; i++) {
      const secFromProc1 = proc1.sectionTemplates[i];
      const secFromProc2 = proc2.sectionTemplates[i];
      if (secFromProc1.sectionName !== secFromProc2.sectionName) {
        console.log(
          `Section names do not match: ${secFromProc1.sectionName} !== ${secFromProc2.sectionName}`
        );
        return false;
      }
      if (secFromProc1.description !== secFromProc2.description) {
        console.log(
          `Section descriptions do not match: ${secFromProc1.description} !== ${secFromProc2.description}`
        );
        return false;
      }
      if (
        secFromProc1.procedureTemplates.length !==
        secFromProc2.procedureTemplates.length
      ) {
        console.log(
          `Procedure template lengths do not match: ${secFromProc1.procedureTemplates.length} !== ${secFromProc2.procedureTemplates.length}`
        );
        return false;
      }
      for (let j = 0; j < secFromProc1.procedureTemplates.length; j++) {
        const procedureTempFromProc1 = secFromProc1.procedureTemplates[j];
        const procedureTempFromProc2 = secFromProc2.procedureTemplates[j];
        if (
          procedureTempFromProc1.procedureName !==
          procedureTempFromProc2.procedureName
        ) {
          console.log(
            `Procedure names do not match: ${procedureTempFromProc1.procedureName} !== ${procedureTempFromProc2.procedureName}`
          );
          return false;
        }
        if (
          procedureTempFromProc1.description !==
          procedureTempFromProc2.description
        ) {
          console.log(
            `Procedure descriptions do not match: ${procedureTempFromProc1.description} !== ${procedureTempFromProc2.description}`
          );
          return false;
        }
        if (
          procedureTempFromProc1.estimatedTime !==
          procedureTempFromProc2.estimatedTime
        ) {
          console.log(
            `Estimated times do not match: ${procedureTempFromProc1.estimatedTime} !== ${procedureTempFromProc2.estimatedTime}`
          );
          return false;
        }
        if (
          procedureTempFromProc1.specialNotes !==
          procedureTempFromProc2.specialNotes
        ) {
          console.log(
            `Special notes do not match: ${procedureTempFromProc1.specialNotes} !== ${procedureTempFromProc2.specialNotes}`
          );
          return false;
        }
      }
    }
    return true;
  };

  it("standard get", async () => {
    const procRes = await request(app).get(`/processTemplates`).send();
    expect(procRes.status).toEqual(200);

    const expectedData = [
      {
        processName: "ProcessName",
        description: "Description",
        sectionTemplates: [],
      },
      {
        processName: "Test Process 1",
        description: "Description 1",
        sectionTemplates: [
          {
            sectionName: "Test Section 1",
            description: "Description 1",
            procedureTemplates: [
              {
                procedureName: "Test Procedure 1",
                estimatedTime: 60,
                description: "",
                specialNotes: "",
              },
            ],
          },
          {
            sectionName: "Test Section 2",
            description: "Description 2",
            procedureTemplates: [
              {
                procedureName: "Test Procedure 2",
                estimatedTime: 120,
                description: "",
                specialNotes: "",
              },
            ],
          },
        ],
      },
    ];

    const responseData = procRes.body;
    expect(responseData.length).toEqual(expectedData.length);
    expect(checkProcessTemplateEqual(responseData[0], expectedData[0])).toBe(
      true
    );
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteProcessData();
    await deleteSectionData();
    await deleteProcedureData();
    await server.close();
    await mongoose.disconnect();
  });
});
