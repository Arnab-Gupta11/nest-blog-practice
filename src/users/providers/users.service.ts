import { CreateUserDto } from './../dtos/create-user.dto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
  ) {}
  public findAllUsers() {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return [
        {
          id: 1,
          name: 'Rahim',
        },
        {
          id: 2,
          name: 'Karim',
        },
      ];
    }
    return { message: 'User is not Authenticated' };
  }

  public findUserById(userId: string) {
    console.log('USER ID:', userId);
    if (userId === '1') {
      return {
        id: 1,
        name: 'Karim',
      };
    }
    return null;
  }

  /**
   * Create new User
   */
  public async createUser(createUserDto: CreateUserDto) {
    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }
}
