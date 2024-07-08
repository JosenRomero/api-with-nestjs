import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from 'src/schemas/Article.schema';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}
}
