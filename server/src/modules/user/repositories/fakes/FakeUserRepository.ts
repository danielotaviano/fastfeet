import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import User from '../../entities/User';
import IUserRepository from '../IUserRepository';

export default class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  async createUser(userInfo: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, userInfo);
    this.users.push(user);

    return user;
  }

  async findByCpf(cpf: string): Promise<User | undefined> {
    const user = this.users.find(user => user.cpf === cpf);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return user;
  }
}
