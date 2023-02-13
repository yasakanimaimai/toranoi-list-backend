import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Logger, 
  Patch, 
  Post, 
  Req, 
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArticleService } from './article.service';
import { Request } from 'express';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleHeadBody } from './dto/articleHeadBody.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { DeleteArticleDto } from './dto/deleteArticle.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('get')
  getTasks(@Req() req: Request): Promise<ArticleHeadBody[]> {
    Logger.log("articleController get")
    return this.articleService.getArticles(req.user.id)
  }

  @Post('create')
  createTask(
    @Req() req: Request,
    @Body() dto: CreateArticleDto
  ): Promise<ArticleHeadBody> {
    Logger.log("articleController create")
    return this.articleService.createArticle(req.user.id, dto);
  }

  @Patch('update')
  updateTaskById(
    @Req() req: Request,
    @Body() dto: UpdateArticleDto,
  ): Promise<ArticleHeadBody> {
    Logger.log("articleController update")
    return this.articleService.updateArticleById(req.user.id, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete')
  deleteTaskById(
    @Req() req: Request,
    @Body() dto: DeleteArticleDto
  ): Promise<void> {
    Logger.log("articleController delete")
    return this.articleService.deleteArticleById(req.user.id, dto.id)
  }
}
