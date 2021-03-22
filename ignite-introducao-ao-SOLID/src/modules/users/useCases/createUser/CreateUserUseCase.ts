import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ email, name }: IRequest): User {
    const userEmailAlreadyExits = this.usersRepository.findByEmail(email);

    if(userEmailAlreadyExits) {
      throw new Error('user email already exits.');
    }

    const createdUser = this.usersRepository.create({
      name,
      email,
    });

    return createdUser;
  }
}

export { CreateUserUseCase };
