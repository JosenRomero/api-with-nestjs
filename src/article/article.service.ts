import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Article } from 'src/schemas/Article.schema';
import { User } from 'src/schemas/User.schema';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { Request } from 'express';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto, req: Request) {
    try {
      const { id } = req.user as User & { id: string };

      const isUserId = mongoose.Types.ObjectId.isValid(id);
      if (!isUserId) throw new BadRequestException('Invalid ID');

      const newArticle = await this.articleModel.create({
        ...createArticleDto,
        user: id,
      });

      return newArticle;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
