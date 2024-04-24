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
const ProcedureInstance = require("../models/procedureInstance.js");
const SectionInstance = require("../models/sectionInstance.js");
const ProcessInstance = require("../models/processInstance.js");
const Patient = require("../models/patient.js");
const Account = require("../models/account.js");
const bcrypt = require("bcrypt");

const testProcessID = "AB12CD34";
const testPwd = bcrypt.hashSync("123", 10);

const testRolePhyscian = new Role({
  uniqueIdentifier: "test_physician",
  name: "test physician",
  description: "testDescription",
});

const testRoleNurse = new Role({
  uniqueIdentifier: "test_nurse",
  name: "test nurse",
  description: "testDescription",
});

const testPhysician = new Account({
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  accountType: "hospital admin",
  position: "physician",
  department: "Health Department",
  degree: "phd",
  phoneNumber: "1234567890",
  password: testPwd,
  eligibleRoles: [testRolePhyscian._id],
  assignedProcedures: [],
});

const testNurse = new Account({
  firstName: "Mary",
  lastName: "Jane",
  email: "maryjane@gmail.com",
  accountType: "staff",
  position: "nurse",
  department: "Health Department",
  degree: "phd",
  phoneNumber: "1234567890",
  password: testPwd,
  eligibleRoles: [testRoleNurse._id],
  assignedProcedures: [],
});

const testPatient = new Patient({
  fullName: "Alice Johnson",
  street: "456 Elm St",
  city: "Smallville",
  state: "NY",
  zip: 54321,
  dob: new Date("1985-05-15"),
  sex: "Female",
  emergencyContacts: [
    {
      name: "Bob Johnson",
      relation: "Spouse",
      phone: "555-111-2222",
    },
    {
      name: "Carol Smith",
      relation: "Parent",
      phone: "555-333-4444",
    },
  ],
  knownConditions: ["Asthma", "Heart disease"],
  allergies: ["Shellfish", "Pollen"],
});

const testAneRoomTemplate = new ResourceTemplate({
  type: "spaces",
  name: "anesthesia room",
});

const testAneRoom = new ResourceInstance({
  type: "spaces",
  name: "anesthesia room",
  location: "Room 102",
  uniqueIdentifier: "AR-102",
});

const testSurRoomTemplate = new ResourceTemplate({
  type: "spaces",
  name: "surgery room",
});

const testSurRoom = new ResourceInstance({
  type: "spaces",
  name: "surgery room",
  location: "Room 222",
  uniqueIdentifier: "SR-222",
});

const testTherRoomTemplate = new ResourceTemplate({
  type: "spaces",
  name: "theorapy room",
});

const testTherRoom = new ResourceInstance({
  type: "spaces",
  name: "theorapy room",
  location: "Room 105",
  uniqueIdentifier: "TR-123",
});

const testUltraRoomTemplate = new ResourceTemplate({
  type: "spaces",
  name: "ultrasound room",
});

const testUltraRoom = new ResourceInstance({
  type: "spaces",
  name: "ultrasound room",
  location: "Room 333",
  uniqueIdentifier: "SR-333",
});

const testSectionInstancePre = new SectionInstance({
  name: "Pre-operative",
  description: "this is preoperative",
  procedureInstances: [],
  processID: testProcessID,
});

const testProcedureInstance1 = new ProcedureInstance({
  procedureName: "Preoperative Theorapy",
  description:
    "A nurse should talk to the patient to assess their mental state",
  rolesAssignedPeople: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
  ],
  peopleMarkAsCompleted: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
  ],
  assignedResources: [testTherRoom._id],
  timeStart: new Date("2024-04-26T10:00:00"),
  timeEnd: new Date("2024-04-26T10:30:00"),
  processID: testProcessID,
  sectionID: testSectionInstancePre._id,
});

const testProcedureInstance2 = new ProcedureInstance({
  procedureName: "Pelvic Ultrasound",
  description:
    "A pelvic ultrasound is a non-invasive imaging procedure that uses sound waves to create images of the structures within the pelvis, aiding in the diagnosis of conditions affecting the reproductive organs, bladder, and surrounding tissues.",
  rolesAssignedPeople: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
    {
      role: testRolePhyscian._id,
      accounts: [testPhysician._id],
    },
  ],
  peopleMarkAsCompleted: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
    {
      role: testRolePhyscian._id,
      accounts: [testPhysician._id],
    },
  ],
  assignedResources: [testUltraRoom._id],
  timeStart: new Date("2024-04-26T11:00:00"),
  timeEnd: new Date("2024-04-26T11:30:00"),
  processID: testProcessID,
  sectionID: testSectionInstancePre._id,
});

const testSectionInstanceIntra = new SectionInstance({
  name: "Intra-operative",
  description: "this is intraoperative",
  procedureInstances: [],
  processID: testProcessID,
});

const testProcedureInstance3 = new ProcedureInstance({
  procedureName: "Anesthesia Shot",
  description:
    "An anesthesia shot should be given to the patient before surgery",
  rolesAssignedPeople: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
    {
      role: testRolePhyscian._id,
      accounts: [testPhysician._id],
    },
  ],
  peopleMarkAsCompleted: [
    {
      role: testRolePhyscian._id,
      accounts: [testPhysician._id],
    },
  ],
  assignedResources: [testAneRoom._id],
  timeStart: new Date("2024-04-26T12:00:00"),
  timeEnd: new Date("2024-04-26T12:30:00"),
  processID: testProcessID,
  sectionID: testSectionInstanceIntra._id,
});

const testProcedureInstance4 = new ProcedureInstance({
  procedureName: "Prostate Removal",
  description: "Surgery to remove the prostate from the patient",
  rolesAssignedPeople: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
    {
      role: testRolePhyscian._id,
      accounts: [testPhysician._id],
    },
  ],
  peopleMarkAsCompleted: [],
  assignedResources: [testSurRoom._id],
  timeStart: new Date("2024-04-26T13:00:00"),
  timeEnd: new Date("2024-04-26T13:30:00"),
  processID: testProcessID,
  sectionID: testSectionInstanceIntra._id,
});

const testSectionInstancePost = new SectionInstance({
  name: "Post-operative",
  description: "this is postoperative",
  procedureInstances: [],
  processID: testProcessID,
});

const testProcedureInstance5 = new ProcedureInstance({
  procedureName: "Post Operation Follow-up",
  description:
    "Information is given to the patient and the patient's family on what they should do and should not do for a speedy recovery.",
  rolesAssignedPeople: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
    {
      role: testRolePhyscian._id,
      accounts: [testPhysician._id],
    },
  ],
  peopleMarkAsCompleted: [],
  assignedResources: [testTherRoom._id],
  timeStart: new Date("2024-04-26T14:00:00"),
  timeEnd: new Date("2024-04-26T14:30:00"),
  processID: testProcessID,
  sectionID: testSectionInstancePost._id,
});

testSectionInstancePre.procedureInstances.push(testProcedureInstance1._id);
testSectionInstancePre.procedureInstances.push(testProcedureInstance2._id);
testSectionInstanceIntra.procedureInstances.push(testProcedureInstance3._id);
testSectionInstanceIntra.procedureInstances.push(testProcedureInstance4._id);
testSectionInstancePost.procedureInstances.push(testProcedureInstance5._id);

testPhysician.assignedProcedures.push(testProcedureInstance2._id);
testPhysician.assignedProcedures.push(testProcedureInstance4._id);
testPhysician.assignedProcedures.push(testProcedureInstance5._id);
testNurse.assignedProcedures.push(testProcedureInstance1._id);
testNurse.assignedProcedures.push(testProcedureInstance2._id);
testNurse.assignedProcedures.push(testProcedureInstance2._id);
testNurse.assignedProcedures.push(testProcedureInstance4._id);
testNurse.assignedProcedures.push(testProcedureInstance5._id);

const testProcess = new ProcessInstance({
  processID: testProcessID,
  processName: "Radical Prostatectomy",
  description: "Surgical removal of the prostate gland",
  sectionInstances: [
    testSectionInstancePre._id,
    testSectionInstanceIntra._id,
    testSectionInstancePost._id,
  ],
  currentProcedure: testProcedureInstance3._id,
  patient: testPatient._id,
});

const clearTestData = async () => {
  await Account.deleteOne({ email: testPhysician.email });
  await Account.deleteOne({ email: testNurse.email });
  await Patient.deleteOne({ fullName: testPatient.fullName });
  await SectionInstance.deleteOne({ name: testSectionInstancePre.name });
  await SectionInstance.deleteOne({ name: testSectionInstanceIntra.name });
  await SectionInstance.deleteOne({ name: testSectionInstancePost.name });
  await ProcedureInstance.deleteOne({
    procedureName: testProcedureInstance1.procedureName,
  });
  await ProcedureInstance.deleteOne({
    procedureName: testProcedureInstance2.procedureName,
  });
  await ProcedureInstance.deleteOne({
    procedureName: testProcedureInstance3.procedureName,
  });
  await ProcedureInstance.deleteOne({
    procedureName: testProcedureInstance4.procedureName,
  });
  await ProcedureInstance.deleteOne({
    procedureName: testProcedureInstance5.procedureName,
  });
  await ProcessInstance.deleteOne({ procedureName: testProcess.procedureName });
  await Role.deleteOne({ name: testRolePhyscian.name });
  await Role.deleteOne({ name: testRoleNurse.name });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testAneRoom.uniqueIdentifier,
  });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testSurRoom.uniqueIdentifier,
  });
  await ResourceTemplate.deleteOne({ name: testSurRoomTemplate.name });
  await ResourceTemplate.deleteOne({ name: testAneRoomTemplate.name });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testTherRoom.uniqueIdentifier,
  });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testUltraRoom.uniqueIdentifier,
  });
  await ResourceTemplate.deleteOne({ name: testUltraRoomTemplate.name });
  await ResourceTemplate.deleteOne({ name: testTherRoomTemplate.name });
};

const addTestData = async () => {
  await testRolePhyscian.save();
  await testRoleNurse.save();
  await testPhysician.save();
  await testNurse.save();
  await testPatient.save();
  await testAneRoomTemplate.save();
  await testAneRoom.save();
  await testSurRoomTemplate.save();
  await testSurRoom.save();
  await testTherRoomTemplate.save();
  await testTherRoom.save();
  await testUltraRoomTemplate.save();
  await testUltraRoom.save();
  await testSectionInstancePre.save();
  await testSectionInstanceIntra.save();
  await testSectionInstancePost.save();
  await testProcedureInstance1.save();
  await testProcedureInstance2.save();
  await testProcedureInstance3.save();
  await testProcedureInstance4.save();
  await testProcedureInstance5.save();
  await testProcess.save();
};

describe("POST /resources for creating resources", () => {
  // Dummy account credentials
  const dummyStaffEmail = "staff@example.com";
  const dummyStaffPassword = "staffPassword123";
  const dummyAdminEmail = "hospitaladmin@example.com";
  const dummyAdminPassword = "hospitalAdminPassword123";
  let server;
  let uids;

  // create dummy accounts
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();

    // comment this function call and the same function call in afterAll to persist the test data
    await clearTestData();

    await addTestData();
  });

  it("unauthorized requests should be rejected", async () => {
    // not signing in and attempt to create resource
    const unauthorizedRes = await request(app).get(`/assignedProcesses`);
    expect(unauthorizedRes.status).toEqual(401);
    expect(unauthorizedRes.text).toEqual("User not logged in");
  });

  it("View empty assignedProcesses", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: dummyAdminEmail,
      password: dummyAdminPassword,
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    const emptyAssignedProcessesRes = await request(app)
      .get(`/assignedProcesses`)
      .set("Cookie", [`accountId=${accountId}`])
      .withCredentials();
    expect(emptyAssignedProcessesRes.status).toEqual(200);
    expect(emptyAssignedProcessesRes.body).toEqual([]);
  });

  it("View test nurse assignedProcesses", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: "maryjane@gmail.com",
      password: "123",
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    const nurseAssignedProcessRes = await request(app)
      .get(`/assignedProcesses`)
      .set("Cookie", [`accountId=${accountId}`])
      .withCredentials();
    expect(nurseAssignedProcessRes.status).toEqual(200);

    const expectedData = {
      processID: testProcessID,
      processName: "Radical Prostatectomy",
      description: "Surgical removal of the prostate gland",
      myProcedure: {
        procedureName: "Anesthesia Shot",
        location: "Room 102",
        timeStart: new Date("2024-04-26T12:00:00").toISOString(),
        timeEnd: new Date("2024-04-26T12:30:00").toISOString(),
      },
      currentProcedure: "Anesthesia Shot",
      patientName: "Alice Johnson",
      procedureAhead: 0,
    };
    console.log("Got data:");
    console.log(nurseAssignedProcessRes.body);
    expect(nurseAssignedProcessRes.body.length).not.toBe(0);
    expect(nurseAssignedProcessRes.body[0]).toEqual(expectedData);
  });

  it("View test physician assignedProcesses", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: "johndoe@gmail.com",
      password: "123",
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    const physicianAssignedProcessRes = await request(app)
      .get(`/assignedProcesses`)
      .set("Cookie", [`accountId=${accountId}`])
      .withCredentials();
    expect(physicianAssignedProcessRes.status).toEqual(200);

    const expectedData = {
      processID: testProcessID,
      processName: "Radical Prostatectomy",
      description: "Surgical removal of the prostate gland",
      myProcedure: {
        procedureName: "Prostate Removal",
        location: "Room 222",
        timeStart: new Date("2024-04-26T13:00:00").toISOString(),
        timeEnd: new Date("2024-04-26T13:30:00").toISOString(),
      },
      currentProcedure: "Anesthesia Shot",
      patientName: "Alice Johnson",
      procedureAhead: 0,
    };
    console.log("Got data:");
    console.log(physicianAssignedProcessRes.body);
    expect(physicianAssignedProcessRes.body.length).not.toBe(0);
    expect(physicianAssignedProcessRes.body[0]).toEqual(expectedData);
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();

    // comment this function call and the same function call in beforeAll to persist the test data
    await clearTestData();

    await server.close();
    await mongoose.disconnect();
  });
});
