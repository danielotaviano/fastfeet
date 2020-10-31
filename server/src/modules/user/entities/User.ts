import { v4 as uuid } from 'uuid';

export default class User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  deliveryman: boolean;
  constructor() {
    this.id = uuid();
  }
}
