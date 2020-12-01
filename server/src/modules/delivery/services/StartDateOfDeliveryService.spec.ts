import BadRequestError from '../../../shared/err/BadRequestError';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import CreateDeliveryService from './CreateDeliveryService';
import StartDateOfDeliveryService from './StartDateOfDeliveryService';

describe('create a startdate of a delivery', () => {
  let startDateOfDelivery: StartDateOfDeliveryService;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let createDelivery: CreateDeliveryService;
  let createUser: CreateUserService;

  beforeEach(() => {
    fakeDeliveryRepository = new FakeDeliveryRepository();
    startDateOfDelivery = new StartDateOfDeliveryService(
      fakeDeliveryRepository,
    );
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
  });
  it('should not be able to create a start date if before 8AM ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 19, 7, 0, 0).getTime();
    });

    await expect(
      startDateOfDelivery.execute({
        delivery_id: 'delivery_id',
        deliveryman_id: 'deliveryman_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to create a start date if after 12PM ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 19, 13, 0, 0).getTime();
    });

    await expect(
      startDateOfDelivery.execute({
        delivery_id: 'delivery_id',
        deliveryman_id: 'deliveryman_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to start a date if deliveryman is not the same of delivery', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 19, 11, 0, 0).getTime();
    });

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
      startDateOfDelivery.execute({
        delivery_id: delivery.id,
        deliveryman_id: 'wrong_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should be able to start a delivery', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 19, 11, 0, 0).getTime();
    });

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

    const started_delivery = await startDateOfDelivery.execute({
      delivery_id: delivery.id,
      deliveryman_id: user.id,
    });

    expect(started_delivery.start_date).toBeTruthy();
  });
});
