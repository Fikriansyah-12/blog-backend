import { ForbiddenException, Injectable } from '@nestjs/common';
import { IArticle } from './interface/article.interface';
import { createArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ArticleQueryDto } from './dto/article-query.dto';

@Injectable()
export class ArticleService {
  //resource
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async createArticle(
    userId: string,
    createArticleDto: createArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let image: string | undefined;

    if (file) {
      image = await this.cloudinaryService.uploadImageStream(file);
    }
    const newArticle = await this.ArticleRepository.create({
      ...createArticleDto,
      image,
      userId,
    });
    return this.ArticleRepository.save(newArticle);
  }

  // Cara mengguakan query params di type ORM
  async findAllArticle(query: ArticleQueryDto){
    const {
      title,
      categoryId,
      page = 1,
      limit = 3,
      sortBy = 'createAt',
      sortOrder = 'desc',
    } = query;

    // Paginations
    const skip = (page - 1) * limit;

    const qb = this.ArticleRepository.createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user');

    if (title) {
      qb.where('article.title ILIKE :title', { title: `%${title}%` }); // Kenapa ILIKE karna biar bisa ke cari dengan kata yang sama tanpa membedakan huruf besar dan kecil "L dan l = itu dibaca sama "ini di postqree
    }

    if (categoryId) {
      qb.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    //Relasi
    const [data,total] = await qb
    .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC'|'DESC')
    .skip(skip)
    .take(limit)
    .select([
        'article',
        'category.name',
        'user.name',
        'user.email'
    ]).getManyAndCount()

    return {
        data,
        total,
        page,
        lastPage: Math.ceil(total/limit)
    }
  }

  async findOneByParams(id: string): Promise<Article | null> {
    return await this.ArticleRepository.findOne({ where: { id } });
  }

  async updateArticleByParams(
    userId: string,
    article: Article,
    UpdateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    const currentUser = await this.ArticleRepository.findOne({
      where: { userId },
    });

    if (!currentUser) {
      throw new ForbiddenException();
    }
    if (file) {
      article.image = await this.cloudinaryService.uploadImageStream(file);
    }

    Object.assign(article, UpdateArticleDto);
    return await this.ArticleRepository.save(article);
  }

  async deleteArticleByParams(
    userId: string,
    articleData: Article,
  ): Promise<void> {
    const currentUser = await this.ArticleRepository.findOne({
      where: { userId },
    });

    if (!currentUser) {
      throw new ForbiddenException();
    }
    await this.ArticleRepository.delete(articleData.id);
  }
}
