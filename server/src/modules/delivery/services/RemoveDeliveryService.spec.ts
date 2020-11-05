import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import CreateDeliveryService from './CreateDeliveryService';
import RemoveDeliveryService from './RemoveDeliveryService';

describe('remove a delivery service', () => {
  let removeDelivery: RemoveDeliveryService;
  let createUser: CreateUserService;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let fakeHashProvider: FakeHashProvider;
  let createDelivery: CreateDeliveryService;
  let fakeUserRepository: FakeUserRepository;
  beforeEach(() => {
    fakeDeliveryRepository = new FakeDeliveryRepository();
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
    removeDelivery = new RemoveDeliveryService(
      fakeDeliveryRepository,
      fakeUserRepository,
    );
  });
  it('should not be able to remove a delivery if delivery does not exist', async () => {
    await expect(
      removeDelivery.execute({
        delivery_id: 'invalid_delivery_id',
        user_id: 'valid_user_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should not be able to remove a delivery if user does not exist', async () => {
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

    await expect(
      removeDelivery.execute({
        delivery_id: delivery.id,
        user_id: 'invalid_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should not be able to remove a delivery if user does not exist', async () => {
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

    await expect(
      removeDelivery.execute({
        delivery_id: delivery.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should be able to remove a delivery ', async () => {
    const userInfo = {
      cpf: 'sameCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const adminInfo = {
      cpf: 'adminCpf',
      deliveryman: false,
      email: 'admin@exemple.com',
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

    const deleteDelivery = await removeDelivery.execute({
      delivery_id: delivery.id,
      user_id: admin.id,
    });

    expect(deleteDelivery).toEqual(delivery);
  });
});
