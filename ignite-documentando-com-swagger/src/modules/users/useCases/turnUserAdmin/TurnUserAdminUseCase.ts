import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class TurnUserAdminUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User {
    const userData = this.usersRepository.findById(user_id);
    
    if(!userData) {
      throw new Error('user does not exits.');
    }

    const userAdminData = this.usersRepository.turnAdmin(userData);

    return userAdminData;
  }
}

export { TurnUserAdminUseCase };
