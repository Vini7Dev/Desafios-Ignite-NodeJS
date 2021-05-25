import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('GetStatementOperation', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it('should be able to get an statement operation', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    const statement = await statementsRepository.create({
      user_id: user.id,
      sender_id: null,
      description: 'Example Description',
      amount: 100,
      type: 'deposit' as OperationType,
    });

    const statementOpration = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(statementOpration).toHaveProperty('id');
    expect(statementOpration.amount).toEqual(100);
  });

  it('should not be able to get an statement operation with inexisting user id', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    const statement = await statementsRepository.create({
      user_id: user.id,
      sender_id: null,
      description: 'Example Description',
      amount: 100,
      type: 'deposit' as OperationType,
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: 'inexisting-user-id',
        statement_id: statement.user_id,
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it('should not be able to get an statement operation with inexisting statement id', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: 'inexisting-statement-id',
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
