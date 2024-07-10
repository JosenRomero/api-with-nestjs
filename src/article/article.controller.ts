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

@UseGuards(AuthGuard('jwt'))
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get(':id')
  getArticle(@Param('id') id: string) {
    return this.articleService.getArticle(id);
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
  deleteArticle(@Param('id') id: string) {
    return this.articleService.deleteArticle(id);
  }

  @Put(':id')
  updateArticle(@Param('id') id: string, @Body() article: CreateArticleDto) {
    return this.articleService.updateArticle(id, article);
  }
}
