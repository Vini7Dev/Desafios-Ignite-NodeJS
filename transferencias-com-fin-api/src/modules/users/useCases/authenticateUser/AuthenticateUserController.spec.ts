import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import request from 'supertest';
import createConnection from '../../../../database';
import { app } from '../../../../app';
import { hash } from 'bcryptjs';

let connection: Connection;

describe('AuthenticateUser Controller', () => {
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

  it('should be able to authenticate user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('should not be able to authenticate user with inexisting email', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'inexisting-email',
      password: 'pass123',
    });

    expect(response.status).toEqual(401);
  });

  it('should not be able to authenticate user with invalid password', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'invalid-password',
    });

    expect(response.status).toEqual(401);
  });
});
