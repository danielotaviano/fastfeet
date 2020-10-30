import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  async createHash(payload: string): Promise<string> {
    return 'hash' + payload;
  }
}
