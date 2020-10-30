import BadRequestError from '../../../shared/err/BadRequestError';
import User from '../entities/User';

// DTOS
interface ICreateUserDTO {
  name: string;
  email: string;
  cpf: string;
  password: string;
  deliveryman: boolean;
}

// Repositorie
interface IUserRepository {
  findByCpf(cpf: string): Promise<User | undefined>;
  createUser(data: ICreateUserDTO): Promise<User>;
}

class FakeUserRepository implements IUserRepository {
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
}

// Service
interface IRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
  deliveryman: boolean;
}

class CreateUserService {
  constructor(private userRepository: IUserRepository) {}
  async execute({
    cpf,
    deliveryman,
    email,
    name,
    password,
  }: IRequest): Promise<User> {
    const existingCpfUser = await this.userRepository.findByCpf(cpf);
    if (existingCpfUser)
      throw new BadRequestError('This cpf is already in use');
    const user = await this.userRepository.createUser({
      cpf,
      deliveryman,
      email,
      name,
      password,
    });
    return user;
  }
}

describe('CreateUserService', () => {
  it('should not be able to create a user with same cpf', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const createUser = new CreateUserService(fakeUserRepository);
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    await createUser.execute(userInfo);

    await expect(createUser.execute(userInfo)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
