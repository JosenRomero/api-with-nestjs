import { HttpException, InternalServerErrorException } from '@nestjs/common';

export class CustomError {
  constructor(error: HttpException | any) {
    if (error instanceof HttpException) {
      throw new HttpException(error.message, error.getStatus());
    } else {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
