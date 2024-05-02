const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const ResourceInstance = require("../models/resourceInstance.js");

const testResourceInstance1 = new ResourceInstance({
  type: "Type1",
  name: "Resource 1",
  location: "Location 1",
  description: "Description 1",
  uniqueIdentifier: "12345",
  unavailableTimes: [],
});

const testResourceInstance2 = new ResourceInstance({
  type: "Type2",
  name: "Resource 2",
  location: "Location 2",
  description: "Description 2",
  uniqueIdentifier: "67890",
  unavailableTimes: [],
});

const testResourceInstanceDNE = new ResourceInstance({
  type: "DNE",
  name: "DNE",
  location: "DNE",
  description: "DNE",
  uniqueIdentifier: "DNE",
  unavailableTimes: [],
});

const addResourceInstances = async () => {
  await testResourceInstance1.save();
  await testResourceInstance2.save();
};

const deleteResourceInstances = async () => {
  await ResourceInstance.deleteOne({ _id: testResourceInstance1._id });
  await ResourceInstance.deleteOne({ _id: testResourceInstance2._id });
};

describe("DELETE /resources/:id", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
    await addResourceInstances();
  });

  it("DELETE /resources/:id bad inputs", async () => {
    const malformedIdRes = await request(app).delete(`/resources/123`).send();
    console.log(malformedIdRes.body);
    expect(malformedIdRes.status).toEqual(500);
    expect(malformedIdRes.body.message).toEqual("Error deleting the resource");

    const dneIdRes = await request(app)
      .delete(`/resources/${testResourceInstanceDNE._id.toString()}`)
      .send();
    expect(dneIdRes.status).toEqual(404);
    expect(dneIdRes.body.message).toEqual("Resource not found");
  });

  it("DELETE /resources/:id usual delete", async () => {
    const resInstRes1 = await request(app)
      .delete(`/resources/${testResourceInstance1._id.toString()}`)
      .send();
    expect(resInstRes1.status).toEqual(200);
    expect(resInstRes1.body).toEqual({
      message: "Resource deleted successfully",
    });

    const resInstRes2 = await request(app)
      .delete(`/resources/${testResourceInstance2._id.toString()}`)
      .send();
    expect(resInstRes2.status).toEqual(200);
    expect(resInstRes2.body).toEqual({
      message: "Resource deleted successfully",
    });

    const res1 = await ResourceInstance.findOne({
      name: testResourceInstance1.name,
    });
    const res2 = await ResourceInstance.findOne({
      name: testResourceInstance2.name,
    });

    expect(res1).toBeNull();
    expect(res2).toBeNull();
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteResourceInstances();
    await server.close();
    await mongoose.disconnect();
  });
});
