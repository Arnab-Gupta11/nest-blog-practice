import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByIdProvider {
  constructor(
    /**
    Inject user repository
    */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Find one user by email.
  public async findOneUserById(id: number) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOneBy({
        id,
      });
    } catch (error) {
      console.log('Error from Find User By email service', error);

      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!existingUser) {
      throw new NotFoundException('User not Found');
    }

    return existingUser;
  }
}
