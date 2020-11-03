import BadRequestError from '../../../shared/err/BadRequestError';
import User from '../entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  user_id: string;
  email: string;
  name: string;
  old_password?: string;
  password?: string;
  deliveryman?: boolean;
}

export default class UpdateUserService {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    deliveryman,
    email,
    name,
    old_password,
    password,
    user_id,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new BadRequestError('User doesnt exist', 404);
    }

    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail && user.email !== email) {
      throw new BadRequestError('This email is already in use', 409);
    }

    Object.assign(user, { email, name, deliveryman });

    if (password && !old_password) {
      throw new BadRequestError('old_password must be required');
    }

    if (password && old_password) {
      const checkPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkPassword) {
        throw new BadRequestError('old_password not matched', 403);
      }
      user.password = await this.hashProvider.createHash(password);
    }
    await this.userRepository.save(user);

    return user;
  }
}
