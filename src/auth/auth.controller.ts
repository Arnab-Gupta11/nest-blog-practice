import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDTO } from './dtos/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Sing In Controller
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signInUser(@Body() signInDto: SignInDTO) {
    return this.authService.signInUser(signInDto);
  }
}
