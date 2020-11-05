import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import CreateDeliveryService from './CreateDeliveryService';
import UpdateDeliveryService from './UpdateDeliveryService';

// service

describe('update a delivery', () => {
  let updateDelivery: UpdateDeliveryService;
  let createDelivery: CreateDeliveryService;
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let createUser: CreateUserService;
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeDeliveryRepository = new FakeDeliveryRepository();
    updateDelivery = new UpdateDeliveryService(
      fakeDeliveryRepository,
      fakeUserRepository,
    );
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
  });
  it('should not be able to update a delivery if delivery not exist', async () => {
    const deliveryInfo = {
      adress: 'adress exemple, 404',
      delivery_id: 'invalidId',
      city: 'new york',
      deliveryman_id: 'invalid_id',
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };
    await expect(updateDelivery.execute(deliveryInfo)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should not be able to update a delivery if deliveryman_id not exist', async () => {
    const userInfo = {
      cpf: 'validCPF',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const user = await createUser.execute(userInfo);

    const deliveryInfo = {
      adress: 'adress exemple, 404',
      delivery_id: 'invalidId',
      city: 'new york',
      deliveryman_id: user.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    const delivery = await createDelivery.execute(deliveryInfo);

    const updatedDeliveryInfo = {
      adress: 'updated adress, 401',
      delivery_id: delivery.id,
      city: 'old york',
      deliveryman_id: 'invalidId',
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    await expect(
      updateDelivery.execute(updatedDeliveryInfo),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should not be able to update a delivery if delivery man is not a delivery man', async () => {
    const userInfo = {
      cpf: 'validCPF',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const userInfo2 = {
      cpf: 'otherCPF',
      deliveryman: false,
      email: 'other@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user1 = await createUser.execute(userInfo);
    const user2 = await createUser.execute(userInfo2);

    const deliveryInfo = {
      adress: 'adress exemple, 404',
      delivery_id: 'invalidId',
      city: 'new york',
      deliveryman_id: user1.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    const delivery = await createDelivery.execute(deliveryInfo);

    const updatedDeliveryInfo = {
      adress: 'updated adress, 401',
      delivery_id: delivery.id,
      city: 'old york',
      deliveryman_id: user2.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    await expect(
      updateDelivery.execute(updatedDeliveryInfo),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should be able to update a delivery', async () => {
    const userInfo = {
      cpf: 'validCPF',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };
    const user = await createUser.execute(userInfo);

    const deliveryInfo = {
      adress: 'adress exemple, 404',
      delivery_id: 'invalidId',
      city: 'new york',
      deliveryman_id: user.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    const delivery = await createDelivery.execute(deliveryInfo);

    const updatedDeliveryInfo = {
      adress: 'updated adress, 401',
      delivery_id: delivery.id,
      city: 'old york',
      deliveryman_id: user.id,
      neighborhood: 'new york neighborhood',
      postal_code: '55555555',
      product: 'product exemple',
      state: 'SP',
    };

    const updatedDelivery = await updateDelivery.execute(updatedDeliveryInfo);

    expect(updatedDelivery.adress).toBe(updatedDeliveryInfo.adress);
    expect(updatedDelivery.city).toBe(updatedDeliveryInfo.city);
    expect(updatedDelivery.adress).toBe(updatedDeliveryInfo.adress);
  });
});
