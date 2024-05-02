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

describe("GET /resources, /resources/byName/:name, /resources/:id", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
    await addResourceInstances();
  });

  const checkResourceInstanceEqual = (inst1, inst2) => {
    if (inst1.type !== inst2.type) return false;
    if (inst1.name !== inst2.name) return false;
    if (inst1.location !== inst2.location) return false;
    if (inst1.description !== inst2.description) return false;
    if (inst1.uniqueIdentifier !== inst2.uniqueIdentifier) return false;
    return true;
  };

  it("GET /resources", async () => {
    const resInstRes = await request(app).get(`/resources`).send();
    expect(resInstRes.status).toEqual(200);

    const expectedData = [
      {
        type: "spaces",
        name: "test room",
        location: "TRoom 102",
        description: "",
        uniqueIdentifier: "TR-102",
      },
      {
        type: "Type",
        name: "Name",
        location: "Location",
        description: "Description",
        uniqueIdentifier: "UniqueIdentifier",
      },
      {
        type: "Type1",
        name: "Resource 1",
        location: "Location 1",
        description: "Description 1",
        uniqueIdentifier: "12345",
      },
      {
        type: "Type2",
        name: "Resource 2",
        location: "Location 2",
        description: "Description 2",
        uniqueIdentifier: "67890",
      },
    ];

    const responseData = resInstRes.body;
    expect(responseData.length).toEqual(expectedData.length);
    for (let i = 0; i < expectedData.length; i++) {
      const inst1 = responseData[i];
      const inst2 = expectedData[i];
      expect(checkResourceInstanceEqual(inst1, inst2)).toBe(true);
    }
  });

  it("GET /resources/byName/:name", async () => {
    const resInstRes1 = await request(app)
      .get(`/resources/byName/${testResourceInstance1.name}`)
      .send();
    expect(resInstRes1.status).toEqual(200);

    const resInstRes2 = await request(app)
      .get(`/resources/byName/${testResourceInstance2.name}`)
      .send();
    expect(resInstRes2.status).toEqual(200);

    const expectedData = [
      {
        type: "Type1",
        name: "Resource 1",
        location: "Location 1",
        description: "Description 1",
        uniqueIdentifier: "12345",
      },
      {
        type: "Type2",
        name: "Resource 2",
        location: "Location 2",
        description: "Description 2",
        uniqueIdentifier: "67890",
      },
    ];

    const responseData1 = resInstRes1.body[0];
    expect(checkResourceInstanceEqual(responseData1, expectedData[0])).toBe(
      true
    );
    const responseData2 = resInstRes2.body[0];
    expect(checkResourceInstanceEqual(responseData2, expectedData[1])).toBe(
      true
    );
  });

  it("GET /resources/:id bad inputs", async () => {
    const malformedIdRes = await request(app).get(`/resources/123`).send();
    console.log(malformedIdRes.body);
    expect(malformedIdRes.status).toEqual(500);
    expect(malformedIdRes.body.message).toEqual("Error fetching the resource");

    const dneIdRes = await request(app)
      .get(`/resources/${testResourceInstanceDNE._id.toString()}`)
      .send();
    expect(dneIdRes.status).toEqual(404);
    expect(dneIdRes.body.message).toEqual("Resource not found");
  });

  it("GET /resources/:id", async () => {
    const resInstRes1 = await request(app)
      .get(`/resources/${testResourceInstance1._id.toString()}`)
      .send();
    expect(resInstRes1.status).toEqual(200);

    const resInstRes2 = await request(app)
      .get(`/resources/${testResourceInstance2._id.toString()}`)
      .send();
    expect(resInstRes2.status).toEqual(200);

    const expectedData = [
      {
        type: "Type1",
        name: "Resource 1",
        location: "Location 1",
        description: "Description 1",
        uniqueIdentifier: "12345",
      },
      {
        type: "Type2",
        name: "Resource 2",
        location: "Location 2",
        description: "Description 2",
        uniqueIdentifier: "67890",
      },
    ];

    const responseData1 = resInstRes1.body;
    expect(checkResourceInstanceEqual(responseData1, expectedData[0])).toBe(
      true
    );
    const responseData2 = resInstRes2.body;
    expect(checkResourceInstanceEqual(responseData2, expectedData[1])).toBe(
      true
    );
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteResourceInstances();
    await server.close();
    await mongoose.disconnect();
  });
});
