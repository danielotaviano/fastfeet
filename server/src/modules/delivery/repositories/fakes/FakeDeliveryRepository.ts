import ICreateDeliveryDTO from '../../dtos/ICreateDeliveryDTO';
import Delivery from '../../entities/Delivery';
import IDeliveryRepository from '../IDeliveryRepository';

export default class FakeDeliveryRepository implements IDeliveryRepository {
  private deliveries: Delivery[] = [];
  async create(deliveryData: ICreateDeliveryDTO): Promise<Delivery> {
    const delivery = new Delivery();

    Object.assign(delivery, deliveryData);

    this.deliveries.push(delivery);

    return delivery;
  }
}
