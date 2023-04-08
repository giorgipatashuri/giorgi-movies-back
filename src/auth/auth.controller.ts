import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthServie: AuthService) {}

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.AuthServie.register(dto);
  }
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.AuthServie.login(dto);
  }
  @Post('login/access-token')
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthServie.getNewTokens(dto);
  }
}
