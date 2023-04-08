import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserModel } from './user.modal';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
  ) {}
  async byId(_id: string) {
    const user = await this.UserModel.findById(_id);
    if (!user) throw new UnauthorizedException(' cannot find User ');

    return user;
  }
  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id);
    const sameUser = await this.UserModel.findOne({ email: dto.email });

    if (sameUser && String(_id) !== String(sameUser._id)) {
      throw new NotFoundException('email busy');
    }
    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin;
    }
    await user.save();
    return user;
  }
  async getCount() {
    return this.UserModel.find().count().exec();
  }
  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }

  async getAll(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options: {
        $or: {
          email: new RegExp(searchTerm, 'i');
        }
      }
    }
    return this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }
}
