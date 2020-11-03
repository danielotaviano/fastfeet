import { v4 as uuid } from 'uuid';
export default class Delivery {
  id: string;
  deliveryman_id: string;
  product: string;
  adress: string;
  postal_code: string;
  neighborhood: string;
  city: string;
  state: string;
  canceled_at: Date;
  signature_id: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = uuid();
  }
}
