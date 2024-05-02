const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const Account = require("../models/account.js");
const Notification = require("../models/notification.js");
const Role = require("../models/role.js");
const bcrypt = require("bcrypt");

const testProcessID = "AB12CD34";
const testPwd = bcrypt.hashSync("123", 10);

const testRolePhysician = new Role({
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
  eligibleRoles: [testRolePhysician._id],
  assignedProcedures: [],
  notificationBox: [],
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
  notificationBox: [],
});

const testNotification1 = new Notification({
  userId: testPhysician._id,
  type: "alert",
  title: "New Alert",
  text: "This is a test alert notification.",
  timeCreated: new Date() - 1000,
});

const testNotification2 = new Notification({
  userId: testNurse._id,
  type: "action",
  title: "Action Required",
  text: "Please complete the assigned task by tomorrow.",
  timeCreated: new Date() - 500,
});

const testNotification3 = new Notification({
  userId: testPhysician._id,
  type: "Chat Message",
  title: "New Chat Message",
  text: "You have a new message from the administrator.",
  timeCreated: new Date() - 100,
});

testNurse.notificationBox.push(testNotification2._id);
testPhysician.notificationBox.push(testNotification1._id);
testPhysician.notificationBox.push(testNotification3._id);

const createTestData = async () => {
  await testRolePhysician.save();
  await testRoleNurse.save();
  await testPhysician.save();
  await testNurse.save();
  await testNotification1.save();
  await testNotification2.save();
  await testNotification3.save();
};

// Helper function to delete test data
const deleteTestData = async () => {
  await Role.deleteOne({ _id: testRolePhysician._id });
  await Role.deleteOne({ _id: testRoleNurse._id });
  await Account.deleteOne({ _id: testPhysician._id });
  await Account.deleteOne({ _id: testNurse._id });
  await Notification.deleteOne({ _id: testNotification1._id });
  await Notification.deleteOne({ _id: testNotification2._id });
  await Notification.deleteOne({ _id: testNotification3._id });
};

const checkNotiEqual = (noti1, noti2) => {
  if (noti1.userId._id.toString() !== noti2.userId._id.toString()) return false;
  if (noti1.title !== noti2.title) return false;
  if (noti1.type !== noti2.type) return false;
  if (noti1.text !== noti2.text) return false;
  return true;
};

describe("GET /users/:userId/notifications for retrieving notifications assigned to a user", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    await initializePredefinedAccounts();
    await createTestData();
  });

  it("bad inputs", async () => {
    const invalidIdRes = await request(app)
      .get(`/users/1233/notifications`)
      .send();
    expect(invalidIdRes.status).toBe(400);
    expect(invalidIdRes.text).toEqual("Invalid User ID");

    const dneIdRes = await request(app)
      .get(`/users/${testNotification3._id.toString()}/notifications`)
      .send();
    expect(dneIdRes.status).toBe(404);
    expect(dneIdRes.text).toEqual("User not found");
  });

  it("should retrieve correct notifications for nurse", async () => {
    const nurseNotiRes = await request(app)
      .get(`/users/${testNurse._id.toString()}/notifications`)
      .send();
    expect(nurseNotiRes.status).toBe(200);

    const expectedNurseNotis = [
      {
        userId: testNurse._id,
        type: "action",
        title: "Action Required",
        text: "Please complete the assigned task by tomorrow.",
      },
    ];

    const nurseResData = nurseNotiRes.body;
    expect(nurseResData.length === expectedNurseNotis.length).toBe(true);
    for (let i = 0; i < expectedNurseNotis.length; i++) {
      const noti1 = expectedNurseNotis[i];
      const noti2 = nurseResData[i];
      expect(checkNotiEqual(noti1, noti2)).toBe(true);
    }
  });

  it("should retrieve correct notifications for physician", async () => {
    const physNotiRes = await request(app)
      .get(`/users/${testPhysician._id.toString()}/notifications`)
      .send();
    expect(physNotiRes.status).toBe(200);

    const expectedPhysNotis = [
      {
        userId: testPhysician._id,
        type: "Chat Message",
        title: "New Chat Message",
        text: "You have a new message from the administrator.",
      },
      {
        userId: testPhysician._id,
        type: "alert",
        title: "New Alert",
        text: "This is a test alert notification.",
      },
    ];

    const physResData = physNotiRes.body;
    expect(physResData.length === expectedPhysNotis.length).toBe(true);
    for (let i = 0; i < expectedPhysNotis.length; i++) {
      const noti1 = expectedPhysNotis[i];
      const noti2 = physResData[i];
      expect(checkNotiEqual(noti1, noti2)).toBe(true);
    }
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteTestData();
    await server.close();
    await mongoose.disconnect();
  });
});
