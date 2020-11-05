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

  async listAll(): Promise<Delivery[]> {
    return this.deliveries;
  }

  async findById(id: string): Promise<Delivery | undefined> {
    const delivery = this.deliveries.find(delivery => delivery.id === id);
    return delivery;
  }

  async save(delivery: Delivery): Promise<Delivery> {
    const findIndex = this.deliveries.findIndex(
      oldDelivery => oldDelivery.id === delivery.id,
    );

    this.deliveries[findIndex] = delivery;
    return delivery;
  }
}
