import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe('CreateUser', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('shoud be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Example Name',
      email: 'example@mail.com',
      password: 'pass123',
    });

    expect(user).toHaveProperty('id');
  });

  it('shoud not be able to create a new user with same email', async () => {
    await createUserUseCase.execute({
      name: 'Example Name',
      email: 'same-email@mail.com',
      password: 'pass123',
    });

    await expect(
      createUserUseCase.execute({
        name: 'Example Name 2',
        email: 'same-email@mail.com',
        password: 'pass123',
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
