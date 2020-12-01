import { getHours, toDate } from 'date-fns';
import BadRequestError from '../../../shared/err/BadRequestError';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

interface IRequest {
  deliveryman_id: string;
  delivery_id: string;
}

// service
export default class StartDateOfDeliveryService {
  constructor(private deliveryRepository: IDeliveryRepository) {}
  async execute({ delivery_id, deliveryman_id }: IRequest): Promise<Delivery> {
    const date = Date.now();

    if (getHours(date) < 8 || getHours(date) > 12) {
      throw new BadRequestError(
        'Date time is invalid, please comeback between a 8AM and 12 PM',
      );
    }

    const delivery = await this.deliveryRepository.findById(delivery_id);

    if (deliveryman_id !== delivery.deliveryman_id) {
      throw new BadRequestError(
        'User logged is not the same deliveryman of a delivery',
      );
    }

    delivery.start_date = toDate(date);

    const updatedDelivery = await this.deliveryRepository.save(delivery);

    return updatedDelivery;
  }
}
