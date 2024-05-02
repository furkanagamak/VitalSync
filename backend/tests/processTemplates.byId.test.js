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

// these data are updated before each "it" run
let testProcedureTemplate1,
  testProcedureTemplate2,
  addProcedureData,
  deleteProcedureData,
  testSectionTemplate1,
  addSectionData,
  deleteSectionData,
  testProcessTemplate1,
  addProcessData,
  deleteProcessData;

describe("GET, PUT, DELETE /processTemplates/:id", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
  });

  beforeEach(async () => {
    testProcedureTemplate1 = new ProcedureTemplate({
      procedureName: "Test Procedure 1",
      requiredResources: [],
      roles: [],
      estimatedTime: 60,
    });

    testProcedureTemplate2 = new ProcedureTemplate({
      procedureName: "Test Procedure 2",
      requiredResources: [],
      roles: [],
      estimatedTime: 120,
    });

    addProcedureData = async () => {
      await testProcedureTemplate1.save();
      await testProcedureTemplate2.save();
    };

    deleteProcedureData = async () => {
      await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate1._id });
      await ProcedureTemplate.deleteOne({ _id: testProcedureTemplate2._id });
    };

    testSectionTemplate1 = new SectionTemplate({
      sectionName: "Test Section 1",
      description: "Description 1",
      procedureTemplates: [testProcedureTemplate1._id],
    });

    addSectionData = async () => {
      await testSectionTemplate1.save();
    };

    deleteSectionData = async () => {
      await SectionTemplate.deleteOne({ _id: testSectionTemplate1._id });
    };

    testProcessTemplate1 = new ProcessTemplate({
      processName: "Test Process 1",
      description: "Description 1",
      sectionTemplates: [testSectionTemplate1._id],
    });

    addProcessData = async () => {
      await testProcessTemplate1.save();
    };

    deleteProcessData = async () => {
      await ProcessTemplate.deleteOne({ _id: testProcessTemplate1._id });
    };
    await addProcedureData();
    await addSectionData();
    await addProcessData();
  });

  // checks for equal of two process template
  // flag 0 means check for procedure field equality
  // flag 1 means check for procedure id equality
  const checkProcessTemplateEqual = (proc1, proc2, flag) => {
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
        if (flag === 0) {
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
        } else {
          if (procedureTempFromProc1 !== procedureTempFromProc2) {
            console.log(
              `procedure id do not match: ${procedureTempFromProc1} !== ${procedureTempFromProc2}`
            );
            return false;
          }
        }
      }
    }
    return true;
  };

  it("GET /processTemplates/:id bad inputs", async () => {
    const malformedIdRes = await request(app)
      .get(`/processTemplates/123`)
      .send();
    console.log(malformedIdRes.body);
    expect(malformedIdRes.status).toEqual(500);
    expect(malformedIdRes.body.message).toEqual(
      "Error retrieving process template"
    );

    const dneIdRes = await request(app)
      .get(`/processTemplates/${testProcedureTemplate1._id.toString()}`)
      .send();
    expect(dneIdRes.status).toEqual(404);
    expect(dneIdRes.body.message).toEqual("Process template not found");
  });

  it("GET /processTemplates/:id usual get", async () => {
    const procRes = await request(app)
      .get(`/processTemplates/${testProcessTemplate1._id.toString()}`)
      .send();
    expect(procRes.status).toEqual(200);

    const expectedData = {
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
      ],
    };

    const responseData = procRes.body;
    expect(checkProcessTemplateEqual(responseData, expectedData, 0)).toBe(true);
  });

  it("PUT /processTemplates/:id bad inputs", async () => {
    const malformedIdRes = await request(app)
      .put(`/processTemplates/123`)
      .send();
    console.log(malformedIdRes.body);
    expect(malformedIdRes.status).toEqual(400);
    expect(malformedIdRes.body.message).toEqual(
      "Failed to update process template"
    );

    const dneIdRes = await request(app)
      .put(`/processTemplates/${testProcedureTemplate1._id.toString()}`)
      .send({
        processName: "Test Process 1 Changed",
        description: "Description 1 Changed",
        sections: [
          {
            _id: testSectionTemplate1._id,
            sectionName: "Test Section 1 Changed",
            description: "Description 1 Changed",
            procedureTemplates: [testProcedureTemplate1._id],
          },
          {
            sectionName: "Test Section 2",
            description: "Description 2",
            procedureTemplates: [testProcedureTemplate2._id],
          },
        ],
      });
    expect(dneIdRes.status).toEqual(404);
    expect(dneIdRes.body.message).toEqual("Process template not found");
  });

  it("PUT /processTemplates/:id usual update", async () => {
    const updateProcessTemplateRes = await request(app)
      .put(`/processTemplates/${testProcessTemplate1._id.toString()}`)
      .send({
        processName: "Test Process 1 Changed",
        description: "Description 1 Changed",
        sections: [
          {
            _id: testSectionTemplate1._id,
            sectionName: "Test Section 1 Changed",
            description: "Description 1 Changed",
            procedureTemplates: [testProcedureTemplate1._id],
          },
          {
            sectionName: "Test Section 2",
            description: "Description 2",
            procedureTemplates: [testProcedureTemplate2._id],
          },
        ],
      });

    expect(updateProcessTemplateRes.status).toEqual(200);

    const newSection = await SectionTemplate.findOne({
      sectionName: "Test Section 2",
    });

    expect(newSection).not.toBeNull();

    const expectedData = {
      processName: "Test Process 1 Changed",
      description: "Description 1 Changed",
      sectionTemplates: [
        {
          sectionName: "Test Section 1 Changed",
          description: "Description 1 Changed",
          procedureTemplates: [testProcedureTemplate1._id.toString()],
        },
        {
          sectionName: "Test Section 2",
          description: "Description 2",
          procedureTemplates: [testProcedureTemplate2._id.toString()],
        },
      ],
    };

    const responseData = updateProcessTemplateRes.body;
    console.log(responseData);
    expect(checkProcessTemplateEqual(responseData, expectedData, 1)).toBe(true);
  });

  it("DELETE /processTemplates/:id bad inputs", async () => {
    const malformedIdRes = await request(app)
      .delete(`/processTemplates/123`)
      .send();
    console.log(malformedIdRes.body);
    expect(malformedIdRes.status).toEqual(500);
    expect(malformedIdRes.body.message).toEqual(
      "Error deleting process template"
    );
  });

  it("DELETE /processTemplates/:id usual delete", async () => {
    const deleteProcessTemplateRes = await request(app)
      .delete(`/processTemplates/${testProcessTemplate1._id.toString()}`)
      .send();

    expect(deleteProcessTemplateRes.status).toBe(200);

    const deletedTemplate = await ProcessTemplate.findOne({
      _id: testProcessTemplate1._id,
    });
    expect(deletedTemplate).toBeNull();
  });

  afterEach(async () => {
    await removePredefinedAccounts();
    await deleteProcessData();
    await deleteSectionData();
    await deleteProcedureData();
    await SectionTemplate.deleteOne({ sectionName: "Test Section 2" });
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });
});
