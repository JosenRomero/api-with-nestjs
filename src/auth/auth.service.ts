import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UserDto } from './dto/User.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto, res: Response) {
    try {
      const { password } = createUserDto;
      const plainToHash = await hash(password, 10);

      createUserDto = { ...createUserDto, password: plainToHash };
      const newUser = await this.userModel.create(createUserDto);

      const { access_token } = await this.signToken(
        newUser.username,
        newUser.email,
      );

      res.cookie('jwt', access_token, { httpOnly: true });

      return {
        message: 'success',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exists');
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  async login(userDto: UserDto, res: Response) {
    try {
      const { email, password } = userDto;

      // find the user by email
      const user = await this.userModel.findOne({ email });

      // if user does not exist throw exception
      if (!user) throw new ForbiddenException('Credentials incorrect');

      // compare password
      const checkPassword = await compare(password, user.password);

      // if password incorrect throw exception
      if (!checkPassword) throw new ForbiddenException('Credentials incorrect');

      const { access_token } = await this.signToken(user.username, user.email);

      res.cookie('jwt', access_token, { httpOnly: true });

      return {
        message: 'success',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  logout(res: Response) {
    res.clearCookie('jwt');

    return {
      message: 'success',
    };
  }

  async signToken(
    username: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: username,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: token,
    };
  }
}
