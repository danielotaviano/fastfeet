import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeJwtProvider from '../providers/JwtProvider/fakes/FakeJwtProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('Authenticate a user', () => {
  let createUserService: CreateUserService;
  let authenticateUser: AuthenticateUserService;
  let fakeJwtProvider: FakeJwtProvider;
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeJwtProvider = new FakeJwtProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeJwtProvider,
    );
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

  it('should not be able to authenticate a user with wrong password', async () => {
    const userInfo = {
      cpf: 'validCpf',
      email: 'email@exemple.com',
      name: 'name exemple',
      password: 'password-exemple',
      deliveryman: true,
    };
    await createUserService.execute(userInfo);

    await expect(
      authenticateUser.execute(userInfo.cpf, 'wrong-password'),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should be able to authenticate a user and create a jwt token', async () => {
    const userInfo = {
      cpf: 'validCpf',
      email: 'email@exemple.com',
      name: 'name exemple',
      password: 'password-exemple',
      deliveryman: true,
    };
    const user = await createUserService.execute(userInfo);

    const userWithToken = await authenticateUser.execute(
      user.cpf,
      userInfo.password,
    );
    expect(userWithToken).toHaveProperty('user');
    expect(userWithToken.user).toBe(user);
    expect(userWithToken).toHaveProperty('token');
    expect(userWithToken.token).toBe(`${user.id}-2h`);
  });
});
