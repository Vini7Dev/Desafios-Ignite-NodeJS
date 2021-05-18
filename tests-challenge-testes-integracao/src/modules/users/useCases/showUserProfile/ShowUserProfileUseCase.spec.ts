import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await usersRepository.create({
      name: 'Example Name',
      email: 'example@email.com',
      password: 'pass123',
    });

    const profile = await showUserProfileUseCase.execute(user.id);

    expect(profile).toEqual(user);
  });

  it('should not be able to show an inexitisng user profile', async () => {
    await expect(
      showUserProfileUseCase.execute('inexisting-user-id')
    ).rejects.toEqual(new ShowUserProfileError());
  });
});
