import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({ 
      where: { id: user_id },
      relations: ['games']
    }) as User;

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM users ORDER BY first_name');
  }

  async findUserByFullName({
    first_name: fn,
    last_name: ln,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query(`SELECT * FROM users AS u WHERE LOWER(u.first_name) = LOWER($1) AND LOWER(u.last_name) = LOWER($2)`, [fn, ln]);

    return users;
  }
}
