import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import CreateDeliveryService from './CreateDeliveryService';

// service

describe('create a delivery service', () => {
  let createDelivery: CreateDeliveryService;
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let createUser: CreateUserService;
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeDeliveryRepository = new FakeDeliveryRepository();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
  });
  it('should not be able to create a delivery with a invalid deliveryman_id', async () => {
    const deliveryInfo = {
      adress: 'adress exemple, 404',
      city: 'new york',
      deliveryman_id: 'invalid_id',
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    await expect(createDelivery.execute(deliveryInfo)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should not be able to create a delivery if user is not a deliveryman', async () => {
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: false,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const user = await createUser.execute(userInfo);

    const deliveryInfo = {
      adress: 'adress exemple, 404',
      city: 'new york',
      deliveryman_id: user.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    await expect(createDelivery.execute(deliveryInfo)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should be able to create a delivery', async () => {
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const user = await createUser.execute(userInfo);

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

    expect(delivery.deliveryman_id).toBe(user.id);
  });
});
