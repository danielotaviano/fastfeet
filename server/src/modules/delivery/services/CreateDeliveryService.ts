import BadRequestError from '../../../shared/err/BadRequestError';
import IUserRepository from '../../user/repositories/IUserRepository';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

interface IRequest {
  deliveryman_id: string;
  product: string;
  adress: string;
  neighborhood: string;
  postal_code: string;
  city: string;
  state: string;
}

export default class CreateDeliveryService {
  constructor(
    private userRepository: IUserRepository,
    private deliveryRepository: IDeliveryRepository,
  ) {}

  async execute({
    adress,
    city,
    deliveryman_id,
    neighborhood,
    postal_code,
    product,
    state,
  }: IRequest): Promise<Delivery> {
    const deliveryman = await this.userRepository.findById(deliveryman_id);
    if (!deliveryman) {
      throw new BadRequestError('This delivery man does not exist', 404);
    }

    if (!deliveryman.deliveryman) {
      throw new BadRequestError('this user is not a delivery man', 400);
    }

    const delivery = await this.deliveryRepository.create({
      adress,
      state,
      product,
      postal_code,
      city,
      deliveryman_id,
      neighborhood,
    });

    return delivery;
  }
}
