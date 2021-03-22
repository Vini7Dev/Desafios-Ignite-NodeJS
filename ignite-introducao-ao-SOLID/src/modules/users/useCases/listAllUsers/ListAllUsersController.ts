import { Request, Response } from "express";

import { ListAllUsersUseCase } from "./ListAllUsersUseCase";

class ListAllUsersController {
  constructor(private listAllUsersUseCase: ListAllUsersUseCase) {}

  handle(request: Request, response: Response): Response {
    const { user_id } = request.headers as { user_id: string };
    // const { user_id } = request.body;

    try {
      const usersList = this.listAllUsersUseCase.execute({
        user_id,
      });

      return response.json(usersList);
    } catch(error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { ListAllUsersController };
