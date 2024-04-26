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
  phone: "444-323-3456",
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
  knownConditions: "Asthma, Heart disease",
  allergies: "Shellfish, Pollen",
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

testPhysician.assignedProcedures.push(testProcedureInstance4._id);
testPhysician.assignedProcedures.push(testProcedureInstance5._id);
testNurse.assignedProcedures.push(testProcedureInstance3._id);
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

const testProcessID2 = "TPID-12312312";

const testPatient2 = new Patient({
  fullName: "John Smith",
  street: "789 Oak St",
  city: "Bigtown",
  state: "CA",
  zip: 12345,
  dob: new Date("1978-10-20"),
  sex: "Male",
  phone: "434-313-3441",
  emergencyContacts: [
    {
      name: "Jane Smith",
      relation: "Spouse",
      phone: "555-123-4567",
    },
    {
      name: "Jack Smith",
      relation: "Sibling",
      phone: "555-789-0123",
    },
  ],
  knownConditions: "Diabetes ,Hypertension",
  allergies: "Penicillin, Bee stings",
});

const testLabRoomTemplate = new ResourceTemplate({
  type: "spaces",
  name: "lab room",
});

const testLabRoom = new ResourceInstance({
  type: "spaces",
  name: "lab room",
  location: "Room 101",
  uniqueIdentifier: "LR-101",
});

const testSectionInstancePre2 = new SectionInstance({
  name: "Pre-operative",
  description: "This is preoperative",
  procedureInstances: [],
  processID: testProcessID2,
});

const testProcedureInstance6 = new ProcedureInstance({
  procedureName: "Blood Test",
  description: "Draw blood samples for testing",
  rolesAssignedPeople: [
    {
      role: testRoleNurse._id,
      accounts: [testNurse._id],
    },
  ],
  peopleMarkAsCompleted: [],
  assignedResources: [testLabRoom._id],
  timeStart: new Date("2024-04-27T09:00:00"),
  timeEnd: new Date("2024-04-27T09:30:00"),
  processID: testProcessID2,
  sectionID: testSectionInstancePre2._id,
});

testSectionInstancePre2.procedureInstances.push(testProcedureInstance6._id);
testNurse.assignedProcedures.push(testProcedureInstance6._id);

const testProcess2 = new ProcessInstance({
  processID: testProcessID2,
  processName: "Routine Checkup",
  description: "Regular health assessment and tests",
  sectionInstances: [testSectionInstancePre2._id],
  currentProcedure: testProcedureInstance6._id,
  patient: testPatient2._id,
});

const clearTestData = async () => {
  await Account.deleteOne({ email: testPhysician.email });
  await Account.deleteOne({ email: testNurse.email });
  await Patient.deleteOne({ fullName: testPatient.fullName });
  await Patient.deleteOne({ fullName: testPatient2.fullName });
  await SectionInstance.deleteOne({ name: testSectionInstancePre.name });
  await SectionInstance.deleteOne({ name: testSectionInstanceIntra.name });
  await SectionInstance.deleteOne({ name: testSectionInstancePost.name });
  await SectionInstance.deleteOne({ name: testSectionInstancePre2.name });
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
  await ProcedureInstance.deleteOne({
    procedureName: testProcedureInstance6.procedureName,
  });
  await ProcessInstance.deleteOne({ processName: testProcess.processName });
  await ProcessInstance.deleteOne({ processName: testProcess2.processName });
  await Role.deleteOne({ name: testRolePhyscian.name });
  await Role.deleteOne({ name: testRoleNurse.name });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testAneRoom.uniqueIdentifier,
  });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testSurRoom.uniqueIdentifier,
  });
  await ResourceInstance.deleteOne({
    uniqueIdentifier: testLabRoom.uniqueIdentifier,
  });
  await ResourceTemplate.deleteOne({ name: testLabRoomTemplate.name });
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

  await testPatient2.save();
  await testLabRoomTemplate.save();
  await testLabRoom.save();
  await testSectionInstancePre2.save();
  await testProcedureInstance6.save();
  await testProcess2.save();
};

describe("GET /assignedProcesses", () => {
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

    const expectedData1 = {
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

    const expectedData2 = {
      processID: testProcessID2,
      processName: "Routine Checkup",
      description: "Regular health assessment and tests",
      myProcedure: {
        procedureName: "Blood Test",
        location: "Room 101",
        timeStart: new Date("2024-04-27T09:00:00").toISOString(),
        timeEnd: new Date("2024-04-27T09:30:00").toISOString(),
      },
      currentProcedure: "Blood Test",
      patientName: "John Smith",
      procedureAhead: 0,
    };

    console.log("Got data:");
    console.log(nurseAssignedProcessRes.body);

    // Check length of the array
    expect(nurseAssignedProcessRes.body.length).toBe(2);

    // Check each item individually
    const receivedData1 = nurseAssignedProcessRes.body[0];
    const receivedData2 = nurseAssignedProcessRes.body[1];

    // Check fields for expectedData1
    expect(receivedData1.processID).toBe(expectedData1.processID);
    expect(receivedData1.processName).toBe(expectedData1.processName);
    expect(receivedData1.description).toBe(expectedData1.description);
    expect(receivedData1.myProcedure.procedureName).toBe(
      expectedData1.myProcedure.procedureName
    );
    expect(receivedData1.myProcedure.location).toBe(
      expectedData1.myProcedure.location
    );
    expect(receivedData1.myProcedure.timeStart).toBe(
      expectedData1.myProcedure.timeStart
    );
    expect(receivedData1.myProcedure.timeEnd).toBe(
      expectedData1.myProcedure.timeEnd
    );
    expect(receivedData1.currentProcedure.procedureName).toBe(
      expectedData1.currentProcedure
    );
    expect(receivedData1.patientName).toBe(expectedData1.patientName);
    expect(receivedData1.procedureAhead).toBe(expectedData1.procedureAhead);

    // Check fields for expectedData2
    expect(receivedData2.processID).toBe(expectedData2.processID);
    expect(receivedData2.processName).toBe(expectedData2.processName);
    expect(receivedData2.description).toBe(expectedData2.description);
    expect(receivedData2.myProcedure.procedureName).toBe(
      expectedData2.myProcedure.procedureName
    );
    expect(receivedData2.myProcedure.location).toBe(
      expectedData2.myProcedure.location
    );
    expect(receivedData2.myProcedure.timeStart).toBe(
      expectedData2.myProcedure.timeStart
    );
    expect(receivedData2.myProcedure.timeEnd).toBe(
      expectedData2.myProcedure.timeEnd
    );
    expect(receivedData2.currentProcedure.procedureName).toBe(
      expectedData2.currentProcedure
    );
    expect(receivedData2.patientName).toBe(expectedData2.patientName);
    expect(receivedData2.procedureAhead).toBe(expectedData2.procedureAhead);
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

    // Get the first item from the response array
    const receivedData = physicianAssignedProcessRes.body[0];

    // Check each field individually
    expect(receivedData.processID).toBe(expectedData.processID);
    expect(receivedData.processName).toBe(expectedData.processName);
    expect(receivedData.description).toBe(expectedData.description);
    expect(receivedData.myProcedure.procedureName).toBe(
      expectedData.myProcedure.procedureName
    );
    expect(receivedData.myProcedure.location).toBe(
      expectedData.myProcedure.location
    );
    expect(receivedData.myProcedure.timeStart).toBe(
      expectedData.myProcedure.timeStart
    );
    expect(receivedData.myProcedure.timeEnd).toBe(
      expectedData.myProcedure.timeEnd
    );
    expect(receivedData.currentProcedure.procedureName).toBe(
      expectedData.currentProcedure
    );
    expect(receivedData.patientName).toBe(expectedData.patientName);
    expect(receivedData.procedureAhead).toBe(expectedData.procedureAhead);
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();

    // comment this function call and the same function call in beforeAll to persist the test data
    // await clearTestData();

    await server.close();
    await mongoose.disconnect();
  });
});
