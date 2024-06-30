import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  singup(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    newUser.save();
    return this.signToken(newUser.username, newUser.email);
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
