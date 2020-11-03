import BadRequestError from '../../../shared/err/BadRequestError';
import FakeUserRepository from '../../user/repositories/fakes/FakeUserRepository';
import IUserRepository from '../../user/repositories/IUserRepository';

// service
interface IRequest {
  deliveryman_id: string;
  product: string;
  adress: string;
  neighborhood: string;
  postal_code: string;
  city: string;
  state: string;
}

class CreateDeliveryService {
  constructor(private userRepository: IUserRepository) {}
  async execute({
    adress,
    city,
    deliveryman_id,
    neighborhood,
    postal_code,
    product,
    state,
  }: IRequest) {
    const deliveryman = await this.userRepository.findById(deliveryman_id);
    if (!deliveryman) {
      throw new BadRequestError('This delivery man does not exist', 404);
    }
  }
}

describe('create a delivery service', () => {
  let createDelivery: CreateDeliveryService;
  let fakeUserRepository: FakeUserRepository;
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    createDelivery = new CreateDeliveryService(fakeUserRepository);
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
});
