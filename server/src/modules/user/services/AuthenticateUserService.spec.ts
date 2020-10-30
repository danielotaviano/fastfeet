import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import IUserRepository from '../repositories/IUserRepository';
import CreateUserService from './CreateUserSerrvice';

// service
class AuthenticateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(cpf: string, password: string) {
    const user = await this.userRepository.findByCpf(cpf);
    if (!user)
      throw new BadRequestError(
        'Invalid user/password, please check again',
        401,
      );
  }
}

describe('Authenticate a user', () => {
  let createUserService: CreateUserService;
  let authenticateUser: AuthenticateUserService;
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUserRepository);
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });
  it('should not be able to authenticate a user that not existing', async () => {
    await expect(
      authenticateUser.execute('unexisting-cpf', 'password'),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
