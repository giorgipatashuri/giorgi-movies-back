import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
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
  @Auth('admin')
  @Get()
  async getAllUsers(@Query('searchTerm') searchTerm?: string) {
    return this.UserService.getAll(searchTerm);
  }
  @Put(':id')
  @Auth('admin')
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
  @Delete(':id')
  async deleteUser(@Param('id', idValidationPipe) id: string) {
    return this.UserService.delete(id);
  }
}
