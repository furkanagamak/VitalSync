/*(const {
    app,
    initializePredefinedAccounts,
    removePredefinedAccounts,
  } = require("../server.js");
  const request = require("supertest");
  const fs = require("fs");
  const mongoose = require("mongoose");

describe('GET /users', () => {
  it('should fetch all users and return JSON', async () => {

    const dummyEmail = "staff@example.com";
    const newPassword = "newPassword123";
    let server;
    let uids;
  
    // Create predefined accounts
    beforeAll(async () => {
      server = app.listen(5001);
      uids = await initializePredefinedAccounts();
    });

    const response = await supertest(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle errors gracefully', async () => {
    const response = await supertest(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(500); // Assuming your server responds with 500 on error

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Failed to fetch users');
  });

  it('should filter terminated users and map to necessary fields', async () => {
    const response = await supertest(app)
      .get('/users')
      .expect(200);

    expect(response.body.every(user => !user.isTerminated)).toBe(true);
    expect(response.body[0]).toHaveProperty('firstName');
    expect(response.body[0]).toHaveProperty('lastName');
    expect(response.body[0]).toHaveProperty('department');
    expect(response.body[0]).toHaveProperty('position');
  });

  // Additional tests for pagination and search filtering can be added here
});*/
