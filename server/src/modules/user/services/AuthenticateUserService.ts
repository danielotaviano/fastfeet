import BadRequestError from '../../../shared/err/BadRequestError';
import User from '../entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IJwtProvider from '../providers/JwtProvider/models/IJwtProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IResponse {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private jwtProvider: IJwtProvider,
  ) {}

  async execute(cpf: string, password: string): Promise<IResponse> {
    const user = await this.userRepository.findByCpf(cpf);
    if (!user)
      throw new BadRequestError(
        'Invalid user/password, please check again',
        401,
      );

    const comparePassword = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!comparePassword) {
      throw new BadRequestError(
        'Invalid user/password, please check again',
        401,
      );
    }

    const token = await this.jwtProvider.generateToken({
      expireIn: '2h',
      userId: user.id,
    });

    return {
      user,
      token,
    };
  }
}
