import ICreateDeliveryDTO from '../dtos/ICreateDeliveryDTO';
import Delivery from '../entities/Delivery';

export default interface IDeliveryRepository {
  create(data: ICreateDeliveryDTO): Promise<Delivery>;
  listAll(): Promise<Delivery[]>;
}
