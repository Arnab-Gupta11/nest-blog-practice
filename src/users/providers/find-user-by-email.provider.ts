import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    /**
    Inject user repository
    */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Find one user by email.
  public async findOneUserByEmail(email: string) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email,
        },
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
