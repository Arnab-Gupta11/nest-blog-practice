import { SignInProvider } from './sign-in.provider';
import { SignInDTO } from '../dtos/signIn.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    /**
    Injecting SingIn Provider
    */
    private readonly signInProvider: SignInProvider,
  ) {}

  public async signInUser(signInDto: SignInDTO) {
    return this.signInProvider.signInUser(signInDto);
  }
}
