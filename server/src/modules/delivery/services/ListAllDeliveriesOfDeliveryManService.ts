import BadRequestError from '../../../shared/err/BadRequestError';
import IUserRepository from '../../user/repositories/IUserRepository';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

export default class ListAllDeliveriesOfDeliveryManService {
  constructor(
    private userRepository: IUserRepository,
    private deliveryRepository: IDeliveryRepository,
  ) {}

  async execute(user_id: string): Promise<Delivery[]> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new BadRequestError('user does not exist', 404);
    }

    if (!user.deliveryman) {
      throw new BadRequestError('this user is not a delivery man', 401);
    }
    const list = await this.deliveryRepository.listByUserId(user_id);

    return list;
  }
}
