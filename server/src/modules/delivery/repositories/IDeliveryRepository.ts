import ICreateDeliveryDTO from '../dtos/ICreateDeliveryDTO';
import Delivery from '../entities/Delivery';

export default interface IDeliveryRepository {
  create(data: ICreateDeliveryDTO): Promise<Delivery>;
  listAll(): Promise<Delivery[]>;
  findById(id: string): Promise<Delivery | undefined>;
  save(delivery: Delivery): Promise<Delivery>;
}
