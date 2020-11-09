import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import CreateDeliveryService from './CreateDeliveryService';
import ListAllDeliveriesOfDeliveryManService from './ListAllDeliveriesOfDeliveryManService';

describe('List all deliveries of a unique delivery man', () => {
  let createDelivery: CreateDeliveryService;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let fakeUserRepository: FakeUserRepository;
  let listAllDeliveriesOfDeliveryMan: ListAllDeliveriesOfDeliveryManService;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;
  beforeEach(() => {
    fakeDeliveryRepository = new FakeDeliveryRepository();

    fakeUserRepository = new FakeUserRepository();
    listAllDeliveriesOfDeliveryMan = new ListAllDeliveriesOfDeliveryManService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });
  it('should not be able to list all deliveries if user does not exist', async () => {
    await expect(
      listAllDeliveriesOfDeliveryMan.execute('invalid_id'),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should not be able to list all deliveries if user is not a delivery man', async () => {
    const userInfo = {
      cpf: 'validcpf',
      deliveryman: false,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo);
    await expect(
      listAllDeliveriesOfDeliveryMan.execute(user.id),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should be able to list all deliveries of a delivery man', async () => {
    const userInfo = {
      cpf: 'validcpf',
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

    const list = await listAllDeliveriesOfDeliveryMan.execute(user.id);

    expect(list).toContain(delivery);
  });
});
