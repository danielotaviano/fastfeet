import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserSerrvice';

describe('CreateUserService', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });
  it('should not be able to create a user with same cpf', async () => {
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

  it('should be able to create a user with a hashed password', async () => {
    const hashCount = jest.spyOn(fakeHashProvider, 'createHash');
    const userInfo = {
      cpf: 'cpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo);

    expect(hashCount).toBeCalledWith(userInfo.password);
    expect(user.password).toBe('hash' + userInfo.password);
  });
});
