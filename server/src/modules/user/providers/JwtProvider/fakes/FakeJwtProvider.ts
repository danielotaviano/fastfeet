import IGenerateJwtTokenDTO from '../dtos/IGenerateJwtTokenDTO';
import IJwtProvider from '../models/IJwtProvider';

export default class FakeJwtProvider implements IJwtProvider {
  async generateToken({
    expireIn,
    userId,
  }: IGenerateJwtTokenDTO): Promise<string> {
    return `${userId}-${expireIn}`;
  }
}
