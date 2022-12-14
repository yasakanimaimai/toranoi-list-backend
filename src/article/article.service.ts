import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ArticleHead, ArticleBody, UserArticle } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleHeadBody } from './dto/articleHeadBody.dto';
import { CreateArticleDto } from './dto/createArticle.dto';
import { DeleteArticleDto } from './dto/deleteArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto'; 

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async getArticles(userId: string): Promise<ArticleHeadBody[]> {
    const articles = await this.prisma.userArticle.findMany({
      where: {
        userId,
      },
      include: {
        article: {
          include: {
            ArticleBody : true
          }
        }
      }
    });
  
    const articleHeadBodies = articles.map((article) => ({
      id: article.article.id,
      siteTitle: article.article.siteTitle,
      siteUrl: article.article.siteUrl,
      abstractText: article.article.ArticleBody.abstractText
    }));

    return articleHeadBodies;
  }

  async createArticle(
    userId: string,
    dto: CreateArticleDto
  ): Promise<ArticleHeadBody> {

    Logger.log('info', "createArticle")

    const articleHead = await this.prisma.articleHead.create({
      data: {
        siteTitle: dto.siteTitle,
        siteUrl: dto.siteUrl,
      }
    });
    

    const articleId = articleHead.id;
    const articleBody = await this.prisma.articleBody.create({
      data: {
        articleId: articleId,
        abstractText: dto.abstractText,
      }
    })
    
    
    const userArticle = await this.prisma.userArticle.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    })

    
    

    return ({
      id: articleId,
      siteTitle : articleHead.siteTitle,
      siteUrl : articleHead.siteUrl,
      abstractText : articleBody.abstractText,
    });
  }

  async updateArticleById(
    userId: string,
    dto: UpdateArticleDto,
  ): Promise<ArticleHeadBody> {
    const article = await this.prisma.userArticle.findFirst({
      where: {
        userId: userId,
        articleId: dto.id,
      },
      include: {
        article: {
          include: {
            ArticleBody : true
          }
        }
      }
    });

    if (!article || article.userId !== userId) throw new ForbiddenException('No permision to update')

    const updatedArticleHead = await this.prisma.articleHead.update({
      where: {
        id: dto.id,
      },
      data: {
        siteTitle: dto.siteTitle,
        siteUrl: dto.siteUrl,
      }
    });

    const updatedArticleBody = await this.prisma.articleBody.update({
      where: {
        articleId: dto.id,
      },
      data: {
        abstractText: dto.abstractText
      },
    })

    return {
      id: updatedArticleHead.id,
      siteTitle : updatedArticleHead.siteTitle,
      siteUrl : updatedArticleHead.siteUrl,
      abstractText : updatedArticleBody.abstractText,
    }
  }

  // ?????????????????????articleBody > userArticle > articleHead
  async deleteArticleById(userId: string, articleId: string): Promise<void> {

    await this.prisma.articleBody.delete({
      where: {
        articleId: articleId
      }
    });

    await this.prisma.userArticle.delete({
      where: {
        userId_articleId: {
          userId: userId,
          articleId: articleId,
        }
      }
    });

    await this.prisma.articleHead.delete({
      where: {
        id: articleId
      }
    });
  }
}
