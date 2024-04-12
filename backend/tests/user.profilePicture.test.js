const {
  app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
} = require("../server.js");
const request = require("supertest");
const fs = require("fs");
describe("PUT /user/profilePicture update profile picture endpoint testing", () => {
  // Dummy account credentials
  const dummyEmail = "staff@example.com";
  const dummyPassword = "staffPassword123";

  // create dummy accounts
  beforeAll(async () => {
    await initializePredefinedAccounts();
  });

  it("Unauthorized requests should be rejected with error message", async () => {
    const res = await request(app).put("/user/profilePicture").expect(400);
    expect(res.text).toEqual("User not logged in");
  });

  it("Uploading profile picture should return a signed URL", async () => {
    // Log in with dummy account to get a valid session
    const loginRes = await request(app).post("/login").send({
      email: dummyEmail,
      password: dummyPassword,
    });

    // Extract accountId from the response cookies
    const accountId = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    // Upload profile picture with a dummy image
    const uploadRes = await request(app)
      .put("/user/profilePicture")
      .withCredentials()
      .set("Cookie", [`accountId=${accountId}`]) // Set the session cookie
      .attach(
        "image",
        fs.readFileSync(__dirname + "/profilepic.png"),
        "profilepic.png"
      ) // Attach a dummy image
      // .expect("Content-Type", /json/)
      .on("error", (err) => console.log(err));

    // Assert that the response contains a signed URL
    expect(uploadRes.status).toEqual(200);
    expect(uploadRes.body).toHaveProperty("message");
    expect(uploadRes.body).toHaveProperty("url");
    expect(uploadRes.body.message).toEqual(
      "Your profile image has been updated!"
    );
    expect(uploadRes.body.url).toBeDefined();
  });

  // remove dummy accounts
  afterAll(async () => {
    await removePredefinedAccounts();
  });
});
