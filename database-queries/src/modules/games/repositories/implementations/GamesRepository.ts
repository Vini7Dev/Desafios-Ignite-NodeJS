import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('game')
      .where(`game.title ILIKE '%${param}%'`)
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(*) FROM games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const usersFinded = await this.repository
      .query(`
        SELECT * FROM games g
        INNER JOIN users_games_games ugg
        ON g."id" = ugg."gamesId"
        INNER JOIN users u
        ON ugg."usersId" = u."id"
      `);

    const usersRocket = usersFinded.filter((uggJoin: any) => {
      if(uggJoin.gamesId === id) {
        return {
          first_name: uggJoin.first_name,
          last_name: uggJoin.last_name,
          email: uggJoin.email
        }
      }
    }); 

    return usersRocket;
  }
}
