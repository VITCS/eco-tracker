import request from 'supertest';
import app from '../src/app';

describe('Activities routes', () => {
  let token = '';

  beforeAll(async () => {
    const email = 'act@example.com';
    const password = 'password123';
    await request(app).post('/api/v1/auth/register').send({ email, password });
    const res = await request(app).post('/api/v1/auth/login').send({ email, password });
    token = res.body.token;
  });

  it('creates a new activity and lists it', async () => {
    const create = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'transport', data: { mode: 'car', km: 10 } })
      .expect(201);
    expect(create.body).toHaveProperty('_id');

    const list = await request(app)
      .get('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(1);
  });
});

