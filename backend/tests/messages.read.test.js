const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");
const Account = require("../models/account.js");
const ProcessInstance = require("../models/processInstance.js");
const Message = require("../models/message.js");
const Role = require("../models/role.js");
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

const message1 = new Message({
  userId: testNurse._id,
  text: "Hey everyone I have just compelted the consultation",
  timeCreated: new Date("2024-04-04T20:05:00"),
});

const message2 = new Message({
  userId: testNurse._id,
  text: "The patient is in a stable state",
  timeCreated: new Date("2024-04-04T20:10:00"),
});

const message3 = new Message({
  userId: testPhysician._id,
  text: "Thank you for your hard work. I will take it from here!",
  timeCreated: new Date("2024-04-04T20:15:00"),
});

const testProcess = new ProcessInstance({
  processID: testProcessID,
  processName: "Radical Prostatectomy",
  description: "Surgical removal of the prostate gland",
  sectionInstances: [],
  currentProcedure: null,
  messageHistory: [message1._id, message2._id, message3._id],
});

const saveTestData = async () => {
  await testRolePhyscian.save();
  await testRoleNurse.save();
  await testPhysician.save();
  await testNurse.save();
  await message1.save();
  await message2.save();
  await message3.save();
  await testProcess.save();
};

const removeTestData = async () => {
  await Role.deleteOne({ _id: testRolePhyscian._id });
  await Role.deleteOne({ _id: testRoleNurse._id });
  await Account.deleteOne({ _id: testPhysician._id });
  await Account.deleteOne({ _id: testNurse._id });
  await Message.deleteOne({ _id: message1._id });
  await Message.deleteOne({ _id: message2._id });
  await Message.deleteOne({ _id: message3._id });
  await ProcessInstance.deleteOne({ _id: testProcess._id });
};

describe("GET /chatMessages/:pid", () => {
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
    await saveTestData();
  });

  it("unauthorized requests should be rejected", async () => {
    // not signing in and attempt to create resource
    const unauthorizedRes = await request(app).get(`/assignedProcesses`);
    expect(unauthorizedRes.status).toEqual(401);
    expect(unauthorizedRes.text).toEqual("User not logged in");
  });

  it("getting chat messages of a process", async () => {
    const loginRes = await request(app).post(`/login`).withCredentials().send({
      email: "johndoe@gmail.com",
      password: "123",
    });
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    const testMessages = await request(app)
      .get(`/chatMessages/${testProcessID}`)
      .set("Cookie", [`accountId=${accountId}`])
      .withCredentials();
    expect(testMessages.status).toEqual(200);

    const expectedData = [
      {
        userId: testNurse._id.toString(),
        userName: "Mary Jane",
        userImage: "",
        text: "Hey everyone I have just compelted the consultation",
        timeCreated: new Date("2024-04-04T20:05:00").toISOString(),
      },
      {
        userId: testNurse._id.toString(),
        userName: "Mary Jane",
        userImage: "",
        text: "The patient is in a stable state",
        timeCreated: new Date("2024-04-04T20:10:00").toISOString(),
      },
      {
        userId: testPhysician._id.toString(),
        userName: "John Doe",
        userImage: "",
        text: "Thank you for your hard work. I will take it from here!",
        timeCreated: new Date("2024-04-04T20:15:00").toISOString(),
      },
    ];
    expect(testMessages.body).toEqual(expectedData);
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
    await removeTestData();
    await server.close();
    await mongoose.disconnect();
  });
});
