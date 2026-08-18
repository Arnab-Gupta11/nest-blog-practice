import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDTO } from './dtos/signIn.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Sing In Controller
  @Post('signin')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  public async signInUser(@Body() signInDto: SignInDTO) {
    return this.authService.signInUser(signInDto);
  }
  //Refresh Token Controller
  @Post('refresh-tokens')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(@Body() refreshTokensDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokensDto);
  }
}
