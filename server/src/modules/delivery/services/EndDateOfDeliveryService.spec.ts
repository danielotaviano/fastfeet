import BadRequestError from '../../../shared/err/BadRequestError';
import FakeHashProvider from '../../user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import CreateUserService from '../../user/services/CreateUserService';
import FakeDeliveryRepository from '../repositories/fakes/FakeDeliveryRepository';
import CreateDeliveryService from './CreateDeliveryService';
import EndDateOfDeliveryService from './EndDateOfDeliveryService';

describe('Finish a delivery with image', () => {
  let endDateOfDelivery: EndDateOfDeliveryService;
  let fakeDeliveryRepository: FakeDeliveryRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeUserRepository: FakeUserRepository;
  let createUser: CreateUserService;
  let createDelivery: CreateDeliveryService;
  beforeEach(() => {
    fakeDeliveryRepository = new FakeDeliveryRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUserRepository();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    createDelivery = new CreateDeliveryService(
      fakeUserRepository,
      fakeDeliveryRepository,
    );
    endDateOfDelivery = new EndDateOfDeliveryService(fakeDeliveryRepository);
  });
  it('should not be able to finish a delivery if delivery_id is not valid', async () => {
    const invalid_delivery_id = 'invalid_id';

    await expect(
      endDateOfDelivery.execute({
        delivery_id: invalid_delivery_id,
        signature_image: 'signature_id.png',
        deliveryman_id: 'deliveryman_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to finish a delivery if deliveryman_id is not a deliveryman of delivery', async () => {
    const userInfo = {
      cpf: 'validCpf',
      deliveryman: true,
      email: 'email@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const anotherUserInfo = {
      cpf: 'validCpf1',
      deliveryman: true,
      email: 'email1@exemple.com',
      name: 'valid name',
      password: 'validpassword',
    };

    const user = await createUser.execute(userInfo);
    const anotherUser = await createUser.execute(anotherUserInfo);

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
      endDateOfDelivery.execute({
        delivery_id: delivery.id,
        signature_image: 'signature_id.png',
        deliveryman_id: anotherUser.id,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should be able to finish a delivery with signature image', async () => {
    const userInfo = {
      cpf: 'validCpf',
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

    const finishedDelivery = await endDateOfDelivery.execute({
      delivery_id: delivery.id,
      deliveryman_id: user.id,
      signature_image: 'image.png',
    });

    expect(finishedDelivery.signature_id).toEqual('image.png');
  });
});
