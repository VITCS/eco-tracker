import request from 'supertest';
import app from '../src/app';

describe('Auth routes', () => {
  const email = 'test@example.com';
  const password = 'password123';

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, name: 'Test User' })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(email);
  });

  it('logs in an existing user and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });
});

