import { CreateUserDto } from './../dtos/create-user.dto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateManyUsersProvider } from './create-many-users.provider';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject AuthService
     */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * Injecting user repository
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /**
     * Injecting many users provider
     */
    private readonly createManyUsersProvider: CreateManyUsersProvider,

    /**
     * Injecting create users provider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * Injecting find user by email  provider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}

  public findAllUsers() {
    return this.userRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  public findUserById(userId: number) {
    return this.userRepository.findOneBy({
      id: userId,
    });
  }

  //Find user by email
  public findOneUserByEmail(email: string) {
    return this.findUserByEmailProvider.findOneUserByEmail(email);
  }
  /**
   * Create new User
   */
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Create new User
   */
  public async createManyUser(createManyUsersDto: CreateManyUsersDto) {
    const newUsers =
      this.createManyUsersProvider.createManyUser(createManyUsersDto);
    return newUsers;
  }
}
