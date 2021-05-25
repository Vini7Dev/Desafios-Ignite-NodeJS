import { Connection } from 'typeorm';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('CreateStatement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const user_id = uuidv4();
    const passwordHash = await hash('pass123', 8);
    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at, updated_at)
      VALUES('${user_id}', 'example', 'example@email.com', '${passwordHash}', '01/01/2021', '01/01/2021')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new deposit statement', async () => {
    const tokenResponse = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    const { token } = tokenResponse.body;

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'Example Description',
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('deposit');
  });

  it('should not be able to create a new deposit statement with invalid token', async () => {
    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'Example Description',
    }).set({
      Authorization: `invalid-token`,
    });

    expect(response.status).toEqual(401);
  });

  it('should be able to create a new withdraw statement', async () => {
    const tokenResponse = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    const { token } = tokenResponse.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 25,
      description: 'Example Description',
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('withdraw');
  });

  it('should not be able to create a new withdraw statement with invalid token', async () => {
    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 25,
      description: 'Example Description',
    }).set({
      Authorization: `invalid-token`,
    });

    expect(response.status).toEqual(401);
  });
});
