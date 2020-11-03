// service

import BadRequestError from '../../../shared/err/BadRequestError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  user_id: string;
  email: string;
  old_password?: string;
  password?: string;
  deliveryman: boolean;
}
class UpdateUserService {
  constructor(private userRepository: IUserRepository) {}
  async execute({
    deliveryman,
    email,
    old_password,
    password,
    user_id,
  }: IRequest) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new BadRequestError('User doesnt exist', 404);
    }
  }
}

describe('update user service', () => {
  let updateUserService: UpdateUserService;
  let fakeUserRepository: FakeUserRepository;
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    updateUserService = new UpdateUserService(fakeUserRepository);
  });
  it('should not be able to update a user that doesnt existing', async () => {
    const userInfo = {
      deliveryman: true,
      email: 'email@exemple.com',
      user_id: 'invalidId',
    };

    await expect(updateUserService.execute(userInfo)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
