import BadRequestError from '../../../shared/err/BadRequestError';
import IUserRepository from '../repositories/IUserRepository';

export default class ListAllUserService {
  constructor(private userRepository: IUserRepository) {}
  async execute(authenticateUserId: string) {
    const authenticateUser = await this.userRepository.findById(
      authenticateUserId,
    );

    if (authenticateUser.deliveryman) {
      throw new BadRequestError('Unauthorized user', 401);
    }

    const users = await this.userRepository.listAll();
    return users;
  }
}
