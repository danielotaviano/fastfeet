import BadRequestError from '../../../shared/err/BadRequestError';
import User from '../entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
  deliveryman: boolean;
}

export default class CreateUserService {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    cpf,
    deliveryman,
    email,
    name,
    password,
  }: IRequest): Promise<User> {
    const existingCpfUser = await this.userRepository.findByCpf(cpf);
    if (existingCpfUser)
      throw new BadRequestError('This cpf is already in use', 409);
    const existingEmailUser = await this.userRepository.findByEmail(email);
    if (existingEmailUser)
      throw new BadRequestError('This Email is already in use', 409);

    const hashedPassword = await this.hashProvider.createHash(password);
    const user = await this.userRepository.createUser({
      cpf,
      deliveryman,
      email,
      name,
      password: hashedPassword,
    });
    return user;
  }
}
