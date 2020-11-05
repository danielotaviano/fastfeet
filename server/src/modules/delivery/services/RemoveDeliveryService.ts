import BadRequestError from '../../../shared/err/BadRequestError';
import IUserRepository from '../../user/repositories/IUserRepository';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

interface IRequest {
  delivery_id: string;
  user_id: string;
}
export default class RemoveDeliveryService {
  constructor(
    private deliveryRepository: IDeliveryRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({ delivery_id, user_id }: IRequest): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(delivery_id);
    if (!delivery) {
      throw new BadRequestError('This delivery is not found', 404);
    }
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new BadRequestError('invalid user', 404);
    }
    if (user.deliveryman) {
      throw new BadRequestError('Unauthorized user', 401);
    }

    return await this.deliveryRepository.remove(delivery_id);
  }
}
