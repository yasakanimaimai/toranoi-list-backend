import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleHeadBody } from './dto/articleHeadBody.dto';
import { CreateArticleDto } from './dto/createArticle.dto';
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
    const articleHead = await this.prisma.articleHead.create({
      data: {
        siteTitle: dto.siteTitle,
        siteUrl: dto.siteUrl,
      }
    });
    
    const articleBody = await this.prisma.articleBody.create({
      data: {
        articleId: articleHead.id,
        abstractText: dto.abstractText,
      }
    })
    
    const userArticle = await this.prisma.userArticle.create({
      data: {
        userId: userId,
        articleId: articleHead.id,
      },
    })

    return ({
      id: articleHead.id,
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

  // 削除する順番はarticleBody > userArticle > articleHead
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
