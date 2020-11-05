import BadRequestError from '../../../shared/err/BadRequestError';
import IUserRepository from '../../user/repositories/IUserRepository';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

interface IRequest {
  delivery_id: string;
  deliveryman_id: string;
  product: string;
  adress: string;
  postal_code: string;
  neighborhood: string;
  city: string;
  state: string;
}
export default class UpdateDeliveryService {
  constructor(
    private deliveryRepository: IDeliveryRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    delivery_id,
    adress,
    city,
    deliveryman_id,
    neighborhood,
    postal_code,
    product,
    state,
  }: IRequest): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(delivery_id);
    if (!delivery) {
      throw new BadRequestError('this delivery doesnt exist', 404);
    }

    const deliveryman = await this.userRepository.findById(deliveryman_id);

    if (!deliveryman || !deliveryman.deliveryman) {
      throw new BadRequestError('This delivery man is not valid', 404);
    }

    Object.assign(delivery, {
      adress,
      city,
      deliveryman_id,
      neighborhood,
      postal_code,
      product,
      state,
    });

    return this.deliveryRepository.save(delivery);
  }
}
