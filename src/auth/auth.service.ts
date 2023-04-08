import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.modal';
import { genSalt, hash, compare } from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { RefreshTokenDto } from './dto/refreshToken.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly UserModel: ModelType<UserModel>,
    private readonly JwtService: JwtService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.validation(dto);
    const tokens = await this.issueTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.JwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('invalid token or expired');

    const user = await this.UserModel.findById(result._id);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({ email: dto.email });
    console.log(oldUser);
    console.log('test2');

    if (oldUser) {
      console.log('test');
      throw new BadRequestException('User is already in the system');
    }
    const salt = await genSalt(10);
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });
    await newUser.save();
    const tokens = await this.issueTokenPair(String(newUser._id));
    return { user: this.returnUserFields(newUser), ...tokens };
  }
  async validation(dto: AuthDto) {
    const user = await this.UserModel.findOne({ email: dto.email });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }
    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid login or password');
    }
    return user;
  }
  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.JwtService.signAsync(data, {
      expiresIn: '15d',
    });
    const accessToken = await this.JwtService.signAsync(data, {
      expiresIn: '1h',
    });
    return { refreshToken, accessToken };
  }
  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
