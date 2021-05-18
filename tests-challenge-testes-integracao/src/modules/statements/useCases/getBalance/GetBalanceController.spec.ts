import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import request from 'supertest';
import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('GetBalance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const user_id = uuidv4();
    const passwordHash = await hash('pass123', 8);
    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at, updated_at)
      VALUES('${user_id}', 'example', 'example@email.com', '${passwordHash}', '01/01/2021', '01/01/2021')
    `);

    const statement_id_1 = uuidv4();
    const statement_id_2 = uuidv4();
    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type, created_at, updated_at)
      VALUES ('${statement_id_1}', '${user_id}', 'balance description', '100', 'deposit', '01/01/2021', '01/01/2021')
    `);
    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type, created_at, updated_at)
      VALUES ('${statement_id_2}', '${user_id}', 'balance description', '25', 'withdraw', '01/01/2021', '01/01/2021')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get user balance', async () => {
    const tokenResponse = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    const { token } = tokenResponse.body;

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(200);
    expect(response.body.balance).toEqual(75);
  });

  it('should not be able to get user balance with invalid token', async () => {
    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `invalid-token`,
    });

    expect(response.status).toEqual(401);
  });
});
