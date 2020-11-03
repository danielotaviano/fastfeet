import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import UpdateUserService from './UpdateUserService';

describe('update user service', () => {
  let updateUserService: UpdateUserService;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;
  let fakeUserRepository: FakeUserRepository;
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeHashProvider = new FakeHashProvider();
    updateUserService = new UpdateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });
  it('should not be able to update a user that doesnt existing', async () => {
    const userInfo = {
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'Name Exemple',
      user_id: 'invalidId',
    };

    await expect(updateUserService.execute(userInfo)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should not be able to update email if email is already in use', async () => {
    const userInfo1 = {
      cpf: 'validCpf1',
      deliveryman: true,
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

    const user1 = await createUser.execute(userInfo1);
    const user2 = await createUser.execute(userInfo2);

    await expect(
      updateUserService.execute({
        user_id: user1.id,
        email: user2.email,
        name: user1.name,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should be able to update just email and name if password and old_password are not passed', async () => {
    const userInfo1 = {
      cpf: 'validCpf1',
      deliveryman: true,
      email: 'email1@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo1);

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      email: 'updated@email.com',
      name: 'updated name',
    });

    expect(updatedUser.name).toBe('updated name');
    expect(updatedUser.email).toBe('updated@email.com');
  });
  it('should not be able to update password if old_password was not passed', async () => {
    const userInfo1 = {
      cpf: 'validCpf1',
      deliveryman: true,
      email: 'email1@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo1);

    await expect(
      updateUserService.execute({
        user_id: user.id,
        email: 'updated@email.com',
        name: 'updated name',
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should not able to update password with old_password doenst match', async () => {
    const userInfo1 = {
      cpf: 'validCpf1',
      deliveryman: true,
      email: 'email1@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo1);

    await expect(
      updateUserService.execute({
        user_id: user.id,
        email: user.email,
        name: user.name,
        password: 'new password',
        old_password: 'invalidpassword',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should able to update password with old_password', async () => {
    const userInfo1 = {
      cpf: 'validCpf1',
      deliveryman: true,
      email: 'email1@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo1);

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      email: user.email,
      name: user.name,
      password: 'new password',
      old_password: 'validpassword',
    });

    expect(updatedUser.password).toBe('hashnew password');
  });
});
