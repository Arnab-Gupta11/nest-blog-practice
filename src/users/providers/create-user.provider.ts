import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
    Inject UserRepository
    */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
    Inject HashingProvider
    */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  /**
   * Create new User
   */
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      //Check is user exists with same email
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      console.log('error from create-user-service', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadGatewayException(
        'The user already exists, please check your email.',
      );
    }

    //Create new user
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      //Save the User
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      console.log('error from create-user-service', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return newUser;
  }
}
