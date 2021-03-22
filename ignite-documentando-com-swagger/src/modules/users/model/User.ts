import { v4 as uuidV4 } from "uuid";

class User {
  public id: string;

  public name: string;

  public admin: boolean;

  public email: string;

  public created_at: Date;

  public updated_at: Date;

  constructor() {
    if(!this.id) {
      this.id = uuidV4();
      this.admin = false;
    }
  }
}

export { User };
