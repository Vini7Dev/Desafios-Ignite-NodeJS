import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('CreateStatement', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it('should be able to create a new statement', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      sender_id: null,
      description: 'Example Description',
      amount: 100,
      type: 'deposit' as OperationType,
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a new statement for an inexisting user', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: 'inexisting-user-id',
        sender_id: null,
        description: 'Example Description',
        amount: 100,
        type: 'deposit' as OperationType,
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it('should not be able to create a new statement as withdraw when user dnot have balance to transaction', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id,
        sender_id: null,
        description: 'Example Description',
        amount: 1000000,
        type: 'withdraw' as OperationType,
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
