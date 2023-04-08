import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RefreshTokenDto } from 'src/auth/dto/refreshToken.dto';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Auth('user')
  @Get('profile')
  async getProfile(@User('_id') _id: string) {
    return this.UserService.byId(_id);
  }
  @Auth('user')
  @Put('profile')
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.UserService.updateProfile(_id, dto);
  }
  @Put(':id')
  @Auth('admin')
  @Put('profile')
  async updateUser(
    @Param('id', idValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.UserService.updateProfile(id, dto);
  }
  @Auth('admin')
  @Get('count')
  async getCount() {
    return this.UserService.getCount();
  }
  @Auth('admin')
  @Get('count')
  async getAll() {
    return this.UserService.getCount();
  }
}
