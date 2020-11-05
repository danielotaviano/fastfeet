import BadRequestError from '../../../shared/err/BadRequestError';
import IUserRepository from '../../user/repositories/IUserRepository';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

export default class ListAllDeliveryService {
  constructor(
    private userRepository: IUserRepository,
    private deliveryRepository: IDeliveryRepository,
  ) {}

  async execute(authenticate_user_id: string): Promise<Delivery[]> {
    const user = await this.userRepository.findById(authenticate_user_id);
    if (user.deliveryman) {
      throw new BadRequestError('Unauthorized user', 401);
    }

    const deliveries = await this.deliveryRepository.listAll();

    return deliveries;
  }
}
