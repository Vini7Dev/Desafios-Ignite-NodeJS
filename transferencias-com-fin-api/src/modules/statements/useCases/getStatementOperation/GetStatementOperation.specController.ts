import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import request from 'supertest';
import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

const statement_id = uuidv4();

describe('GetStatementOperation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const user_id = uuidv4();
    const passwordHash = await hash('pass123', 8);
    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at, updated_at)
      VALUES('${user_id}', 'example', 'example@email.com', '${passwordHash}', '01/01/2021', '01/01/2021')
    `);

    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type, created_at, updated_at)
      VALUES ('${statement_id}', '${user_id}', 'balance description', '100', 'deposit', '01/01/2021', '01/01/2021')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get an statement operation', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to get an statement operation with invalid token', async () => {
    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `invalid-token`,
      });

    expect(response.status).toEqual(400);
  });

  it('should not be able to get an statement operation with inexisting id', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'example@email.com',
      password: 'pass123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get(`/api/v1/statements/invalid-statement-id`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toEqual(400);
  });
});
