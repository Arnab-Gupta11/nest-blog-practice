import { CreateUserDto } from './../dtos/create-user.dto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateManyUsersProvider } from './create-many-users.provider';

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
    private readonly createManyUsersProvider : CreateManyUsersProvider,


  ) {}
  public findAllUsers() {
    return this.userRepository.find({
      relations:{
        posts:true
      }
    });
  }

  public findUserById(userId: number) {
   return this.userRepository.findOneBy({
    id:userId
   }) 
  }

  /**
   * Create new User
   */
  public async createUser(createUserDto: CreateUserDto) {
    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * Create new User
   */
  public async createManyUser(createManyUsersDto: CreateManyUsersDto) {
    const newUsers = this.createManyUsersProvider.createManyUser(createManyUsersDto);
    return newUsers;
  }
  
}
