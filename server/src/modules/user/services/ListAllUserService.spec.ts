import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserSerrvice';
import ListAllUserService from './ListAllUserService';

describe('list all users service', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let listAll: ListAllUserService;
  let createUser: CreateUserService;
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    listAll = new ListAllUserService(fakeUserRepository);
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });
  it('should not be able to list all users if not authorized', async () => {
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo);

    await expect(listAll.execute(user.id)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should be able to list all users', async () => {
    const userInfo1 = {
      cpf: 'validCpf1',
      deliveryman: false,
      email: 'email1@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const userInfo2 = {
      cpf: 'validCpf2',
      deliveryman: true,
      email: 'email2@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const userInfo3 = {
      cpf: 'validCpf3',
      deliveryman: false,
      email: 'email3@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const userInfo4 = {
      cpf: 'validCpf4',
      deliveryman: true,
      email: 'email4@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user1 = await createUser.execute(userInfo1);
    const user2 = await createUser.execute(userInfo2);
    const user3 = await createUser.execute(userInfo3);
    const user4 = await createUser.execute(userInfo4);

    const allUsers = await listAll.execute(user1.id);

    expect(allUsers).toEqual([user1, user2, user3, user4]);
  });
});
