import { Request, Response } from "express";

import { TurnUserAdminUseCase } from "./TurnUserAdminUseCase";

class TurnUserAdminController {
  constructor(private turnUserAdminUseCase: TurnUserAdminUseCase) {}

  handle(request: Request, response: Response): Response {
    const { user_id } = request.params;

    try {
      const userData = this.turnUserAdminUseCase.execute({ user_id });

      return response.json(userData);
    } catch(error) {
      return response.status(404).json({ error: error.message });
    }
  }
}

export { TurnUserAdminController };
