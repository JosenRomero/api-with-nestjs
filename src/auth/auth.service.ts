import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UserDto } from './dto/User.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const plainToHash = await hash(password, 10);

    createUserDto = { ...createUserDto, password: plainToHash };
    const newUser = await this.userModel.create(createUserDto);

    return this.signToken(newUser.username, newUser.email);
  }

  async login(userDto: UserDto) {
    const { email, password } = userDto;

    // find the user by email
    const user = await this.userModel.findOne({ email });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const checkPassword = await compare(password, user.password);

    // if password incorrect throw exception
    if (!checkPassword) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.username, user.email);
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
