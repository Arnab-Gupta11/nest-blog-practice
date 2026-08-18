import { SignInProvider } from './sign-in.provider';
import { SignInDTO } from '../dtos/signIn.dto';
import { Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
    Injecting SingIn Provider
    */
    private readonly signInProvider: SignInProvider,
    /**
    Injecting refresh token Provider
    */
    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}

  public async signInUser(signInDto: SignInDTO) {
    return this.signInProvider.signInUser(signInDto);
  }
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDto);



  }
}
