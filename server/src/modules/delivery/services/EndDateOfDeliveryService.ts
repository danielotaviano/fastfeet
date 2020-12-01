import BadRequestError from '../../../shared/err/BadRequestError';
import Delivery from '../entities/Delivery';
import IDeliveryRepository from '../repositories/IDeliveryRepository';

interface IRequest {
  delivery_id: string;
  deliveryman_id: string;
  signature_image: string;
}

export default class EndDateOfDeliveryService {
  constructor(private deliveryRepository: IDeliveryRepository) {}
  async execute({
    delivery_id,
    deliveryman_id,
    signature_image,
  }: IRequest): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(delivery_id);
    if (!delivery) {
      throw new BadRequestError('This delivery_id is not a valid id');
    }
    if (delivery.deliveryman_id !== deliveryman_id) {
      throw new BadRequestError(
        'this delivery does not belong to that deliveryman',
      );
    }
    delivery.signature_id = signature_image;
    const finishedDelivery = await this.deliveryRepository.save(delivery);

    return finishedDelivery;
  }
}
