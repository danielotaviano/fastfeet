// service

import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import CreateDeliveryService from './CreateDeliveryService';
import ListAllDeliveryService from './ListAllDeliveryService';

describe('list all delivery service', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let createDelivery: CreateDeliveryService;
  let listAllDelivery: ListAllDeliveryService;
  let createUser: CreateUserService;
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeDeliveryRepository = new FakeDeliveryRepository();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    listAllDelivery = new ListAllDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
  });

  it('should not be able to list all delivery service if user is not a admin', async () => {
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo);

    await expect(listAllDelivery.execute(user.id)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('should be able to list all delivery service if user is a admin', async () => {
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const adminInfo = {
      cpf: 'sameCpf1',
      deliveryman: false,
      email: 'email@exemple.com1',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo);
    const admin = await createUser.execute(adminInfo);

    const deliveryInfo = {
      adress: 'adress exemple, 404',
      city: 'new york',
      deliveryman_id: user.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    const delivery = await createDelivery.execute(deliveryInfo);

    const list = await listAllDelivery.execute(admin.id);

    expect(list).toContain(delivery);
  });
});
