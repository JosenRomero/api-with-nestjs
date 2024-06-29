import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValidID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidID) throw new HttpException('User not found', 404);
    const findUser = await this.usersService.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  // users/:id
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isValidID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidID) throw new HttpException('Invalid ID', 400);
    return this.usersService.updateUser(id, updateUserDto);
  }
}
