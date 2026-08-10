import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDTO } from '../dtos/signIn.dto';

@Injectable()
export class SignInProvider {
  constructor(
    /**
    Injecting user service
    */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
    Inject HashingProvider
    */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  //Login user
  public async signInUser(signInDto: SignInDTO) {
    const user = await this.userService.findOneUserByEmail(signInDto.email);
    const isPasswordMatch = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Passwor is not correct.');
    }

    return true;
  }
}
