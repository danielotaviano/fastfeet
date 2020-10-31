import IGenerateJwtTokenDTO from '../dtos/IGenerateJwtTokenDTO';

export default interface IJwtProvider {
  generateToken(data: IGenerateJwtTokenDTO): Promise<string>;
}
