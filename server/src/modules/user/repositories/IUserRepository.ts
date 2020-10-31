import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../entities/User';

export default interface IUserRepository {
  findByCpf(cpf: string): Promise<User | undefined>;
  createUser(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
  listAll(): Promise<User[]>;
}
