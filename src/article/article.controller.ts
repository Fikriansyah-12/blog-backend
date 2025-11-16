import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { createArticleDto } from './dto/create-article.dto';
import type { IArticle } from './interface/article.interface';
import { findOneParams } from './dto/find-one.params';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decolator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleQueryDto } from './dto/article-query.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  async findAll(@Query() query: ArticleQueryDto) {
    return await this.articleService.findAllArticle(query);
  }

  @Get('/:id')
  async findOne(@Param() params: findOneParams): Promise<Article> {
    return await this.findOneOrFail(params.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createArticleDto: createArticleDto,
  ): Promise<Article> {
    return await this.articleService.createArticle(
      req.user.id,
      createArticleDto,
      file,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Param() params: findOneParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOneOrFail(params.id);
    return await this.articleService.updateArticleByParams(
      req.user.id,
      article,
      updateArticleDto,
      file
    );
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
        @Request() req,
    @Param() params: findOneParams
): Promise<void> {
    const article = await this.findOneOrFail(params.id);
    await this.articleService.deleteArticleByParams(req.user.id,article);
  }

  private async findOneOrFail(id: string): Promise<Article> {
    const article = await this.articleService.findOneByParams(id);
    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }
}
