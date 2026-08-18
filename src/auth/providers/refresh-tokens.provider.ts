import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
    Injecting user service
    */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    /**
    Inject JWT service
    */
    private readonly jwtService: JwtService,

    /**
    Inject JWT configuration
    */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
    Inject Generate tokens provider
    */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  //Refresh new tokens
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    //verify the refresh token using jwtsrvice
    const { sub } = await this.jwtService.verifyAsync(
      refreshTokenDto.refreshToken,
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
    //Fetch user from the database
    const user = await this.userService.findUserById(sub);

    //Generate the tokens
    const tokens = this.generateTokensProvider.generateTokens(user);
    return tokens;
  }
}
