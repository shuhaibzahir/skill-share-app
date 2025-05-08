const { expect } = require('chai');
const request = require('supertest');
const app = require('../server'); // Your Express app (exported from app.js or index.js)

describe('POST /api/auth/register', () => {
  it('should register a new individual user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        type: 'individual',
        role: 'provider',
        firstName: 'John',
        lastName: 'Doe',
        email: `john${Date.now()}@example.com`,
        mobileNumber: '1234567890',
        password: 'SecureP@ssword123',
        address: {  // Include the address object here
          streetNumber: '123',
          streetName: 'Main St',
          city: 'Cityville',
          state: 'Stateville',
          postCode: '12345'
        }
      });
    // Test that the response is as expected
    expect(res.status).to.equal(201); // Expect 201 status for successful creation
    expect(res.body).to.have.property('success', true); // Should have success property
    expect(res.body.data).to.have.property('email'); // Should return an ID
   });
});
