import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDTO } from '../dtos/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

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

    /**
    Inject JWT service
    */
    private readonly jwtService: JwtService,

    /**
    Inject JWT configuration
    */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return {
      accessToken,
    };
  }
}
