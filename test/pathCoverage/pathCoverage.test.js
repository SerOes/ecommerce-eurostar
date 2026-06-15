import { expect } from 'chai';
import supertest from 'supertest';

// Rule 3.6: Supertest runs against the running HTTP server, not the app object.
const PORT = process.env.PORT || '3001';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const request = supertest(BASE_URL);

/**
 * Path Coverage suite.
 *
 * The API exposes 4 paths (swagger.yaml):
 *   1. GET  /healthcheck
 *   2. POST /register
 *   3. POST /login
 *   4. POST /checkout
 *
 * One test per path => 100% path coverage (4/4).
 * All test data is taken from README.md.
 */
describe('Path Coverage - E-Commerce Eurostar REST API', () => {
  // Path 1 of 4: GET /healthcheck
  it('PATH 1 - GET /healthcheck', async () => {
    const res = await request.get('/healthcheck');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'UP');
    expect(res.body).to.have.property('message', 'E-commerce API is healthy.');
  });

  // Path 2 of 4: POST /register
  it('PATH 2 - POST /register', async () => {
    const res = await request
      .post('/register')
      .send({
        email: 'customer@example.com',
        password: 'mypassword123',
        name: 'New Customer'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'User registered successfully.');
    expect(res.body.user).to.include({
      email: 'customer@example.com',
      name: 'New Customer'
    });
  });

  // Path 3 of 4: POST /login
  it('PATH 3 - POST /login', async () => {
    const res = await request
      .post('/login')
      .send({
        email: 'john@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Login successful.');
    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body.user).to.include({
      email: 'john@example.com',
      name: 'John Doe'
    });
  });

  // Path 4 of 4: POST /checkout (protected - requires a JWT from /login)
  it('PATH 4 - POST /checkout', async () => {
    const login = await request
      .post('/login')
      .send({
        email: 'john@example.com',
        password: 'password123'
      });

    const token = login.body.token;

    const res = await request
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        paymentMethod: 'cash',
        items: [
          { productId: 'prod-1', quantity: 1 },
          { productId: 'prod-3', quantity: 2 }
        ]
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('paymentMethod', 'cash');
    expect(res.body).to.have.property('originalTotal', 1200);
    expect(res.body).to.have.property('discount', 120);
    expect(res.body).to.have.property('finalTotal', 1080);
  });
});
