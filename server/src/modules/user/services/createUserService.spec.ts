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
  findByEmail(email: string): Promise<User | undefined>;
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

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
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
      throw new BadRequestError('This cpf is already in use', 409);
    const existingEmailUser = await this.userRepository.findByEmail(email);
    if (existingEmailUser)
      throw new BadRequestError('This Email is already in use', 409);
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

  it('should not be able to create a user with same email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const createUser = new CreateUserService(fakeUserRepository);
    const userInfo = {
      cpf: 'cpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    await createUser.execute(userInfo);

    await expect(
      createUser.execute({ ...userInfo, cpf: 'cpf1' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
