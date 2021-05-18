import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('ShowUserProfile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const passwordHash = await hash('pass123', 8);
    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at, updated_at)
      VALUES ('${id}', 'example', 'example@email.com', '${passwordHash}', '01/01/2021', '01/01/2021')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show prifile data', async () => {
    const tokenResponse = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    const { token } = tokenResponse.body;

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to show prifile data with invalid token', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `invalid-token`,
    });

    expect(response.status).toEqual(401);
  });
});
