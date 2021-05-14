import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to authenticate user', async () => {
    const userData = {
      name: 'Example name',
      email: 'example@email.com',
      password: 'pass123',
    }

    const user = await createUserUseCase.execute(userData);

    const tokenAndUser = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(tokenAndUser).toHaveProperty('token');
    expect(tokenAndUser).toHaveProperty('user');
    expect(tokenAndUser.user.id).toEqual(user.id);
  });

  it('should not be able to authenticate with inexisting user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'inexisting-email',
        password: 'pass123',
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it('should not be able to authenticate with invalid credentials', async () => {
    await createUserUseCase.execute({
      name: 'Example name',
      email: 'example@email.com',
      password: 'pass123',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'example@email.com',
        password: 'invalid-password',
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
