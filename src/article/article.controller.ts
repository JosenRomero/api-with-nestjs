import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ArticleParametersDto } from './dto/ArticleParameters.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getArticle(@Param() params: ArticleParametersDto) {
    return this.articleService.getArticle(params.id);
  }

  @Get()
  getAllArticles(@Req() req: Request) {
    return this.articleService.getAllArticles(req);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: Request,
  ) {
    return this.articleService.createArticle(createArticleDto, req);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteArticle(@Param() params: ArticleParametersDto) {
    return this.articleService.deleteArticle(params.id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateArticle(
    @Param() params: ArticleParametersDto,
    @Body() article: CreateArticleDto,
  ) {
    return this.articleService.updateArticle(params.id, article);
  }
}
