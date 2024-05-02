const {
  server: app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
const mongoose = require("mongoose");
const ResourceTemplate = require("../models/resourceTemplate.js");

const testResourceTemplate1 = new ResourceTemplate({
  type: "equipment",
  name: "test equipment 111",
  description: "test equipment 111 description",
});

const testResourceTemplate2 = new ResourceTemplate({
  type: "equipment",
  name: "test equipment 222",
  description: "test equipment 222 description",
});

const testResourceTemplate3 = new ResourceTemplate({
  type: "equipment",
  name: "test equipment 333",
  description: "test equipment 333 description",
});

const testResourceTemplate4 = new ResourceTemplate({
  type: "spaces",
  name: "test spaces 444",
  description: "test equipment 444 description",
});

const testResourceTemplate5 = new ResourceTemplate({
  type: "equipment",
  name: "test spaces 555",
  description: "test equipment 555 description",
});

const testResourceTemplate6 = new ResourceTemplate({
  type: "equipment",
  name: "test spaces 666",
  description: "test equipment 666 description",
});

const addData = async () => {
  await testResourceTemplate1.save();
  await testResourceTemplate2.save();
  await testResourceTemplate3.save();
  await testResourceTemplate4.save();
  await testResourceTemplate5.save();
  await testResourceTemplate6.save();
};

const deleteData = async () => {
  await ResourceTemplate.deleteOne({ _id: testResourceTemplate1._id });
  await ResourceTemplate.deleteOne({ _id: testResourceTemplate2._id });
  await ResourceTemplate.deleteOne({ _id: testResourceTemplate3._id });
  await ResourceTemplate.deleteOne({ _id: testResourceTemplate4._id });
  await ResourceTemplate.deleteOne({ _id: testResourceTemplate5._id });
  await ResourceTemplate.deleteOne({ _id: testResourceTemplate6._id });
};

describe("GET /resourceTemplates for editing resources", () => {
  beforeAll(async () => {
    server = app.listen(5001);
    uids = await initializePredefinedAccounts();
    await addData();
  });

  const checkResTempEqual = (resTemp1, resTemp2) => {
    if (resTemp1.type !== resTemp2.type) return false;
    if (resTemp1.name !== resTemp2.name) return false;
    if (resTemp1.description !== resTemp2.description) return false;
    return true;
  };

  it("expected data should be returned", async () => {
    // update existing role
    const resTempRes = await request(app).get(`/resourceTemplates`).send();
    expect(resTempRes.status).toEqual(200);

    const existingResource1 = await ResourceTemplate.findOne({
      name: "test room",
    });
    const existingResource2 = await ResourceTemplate.findOne({ name: "Name" });
    if (!existingResource1 || !existingResource2)
      throw new Error("Please run dbtest.js script first!");

    const expectedData = [
      {
        type: "spaces",
        name: "test room",
        description: "",
      },
      {
        type: "Type",
        name: "Name",
        description: "Description",
      },
      {
        type: "equipment",
        name: "test equipment 111",
        description: "test equipment 111 description",
      },
      {
        type: "equipment",
        name: "test equipment 222",
        description: "test equipment 222 description",
      },
      {
        type: "equipment",
        name: "test equipment 333",
        description: "test equipment 333 description",
      },
      {
        type: "spaces",
        name: "test spaces 444",
        description: "test equipment 444 description",
      },
      {
        type: "equipment",
        name: "test spaces 555",
        description: "test equipment 555 description",
      },
      {
        type: "equipment",
        name: "test spaces 666",
        description: "test equipment 666 description",
      },
    ];

    const responseData = resTempRes.body;
    expect(responseData.length).toEqual(expectedData.length);
    for (let i = 0; i < expectedData.length; i++) {
      const resTemp1 = responseData[i];
      const resTemp2 = expectedData[i];
      expect(checkResTempEqual(resTemp1, resTemp2)).toBe(true);
    }
  });

  afterAll(async () => {
    await removePredefinedAccounts();
    await deleteData();
    await server.close();
    await mongoose.disconnect();
  });
});
