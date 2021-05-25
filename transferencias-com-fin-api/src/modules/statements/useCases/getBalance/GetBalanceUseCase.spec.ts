import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('GetBalance', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  });

  it('shoud be able to get user balance', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    await statementsRepository.create({
      user_id: user.id,
      sender_id: null,
      description: 'Example Description',
      amount: 100,
      type: 'deposit' as OperationType,
    });

    await statementsRepository.create({
      user_id: user.id,
      sender_id: null,
      description: 'Example Description 2',
      amount: 50,
      type: 'deposit' as OperationType,
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.statement).toHaveLength(2);
    expect(balance.balance).toEqual(150);
  });


  it('shoud not be able to get a inexisting user balance', async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: 'inexisting-user-id' })
    ).rejects.toEqual(new GetBalanceError());
  });
});
