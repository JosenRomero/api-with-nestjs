import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Article } from 'src/schemas/Article.schema';
import { User } from 'src/schemas/User.schema';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { Request } from 'express';
import { CustomError } from 'src/utils/customError';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async getArticle(id: string) {
    try {
      const isArticleId = mongoose.Types.ObjectId.isValid(id);
      if (!isArticleId) throw new BadRequestException('Invalid ID');

      const article = await this.articleModel.findOne({ _id: id });
      if (!article) throw new NotFoundException('Article not found');

      return article;
    } catch (error) {
      new CustomError(error);
    }
  }

  async getAllArticles(req: Request) {
    try {
      const { id } = req.user as User & { id: string };

      const isUserId = mongoose.Types.ObjectId.isValid(id);
      if (!isUserId) throw new BadRequestException('Invalid ID');

      const articles = await this.articleModel.find({ user: id });

      return articles;
    } catch (error) {
      new CustomError(error);
    }
  }

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
      new CustomError(error);
    }
  }
}
